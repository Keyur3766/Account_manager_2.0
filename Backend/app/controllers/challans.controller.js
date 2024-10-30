const pdfTemplate = require("../documents/index");
const Challan = require("../models/challans.modal");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const fs = require('fs')


// Get pending challan count
exports.findAndGetChallans = async(req,res)=>{
    let id = new mongoose.Types.ObjectId(req.params.id);

    try{
        const challans = await Challan.aggregate([
            {
                $match: {
                    payment_status: false,
                    customer_id: id
                }
            },
            {
                $group: {
                    _id: {
                        customer_id: '$customer_id',
                        issue_date: '$issue_date'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field from the result
                    customer_id: '$_id.customer_id',
                    issue_date: '$_id.issue_date',
                    count: 1
                }
            }
        ]);

        const size = Object.keys(challans).length;

        res.status(200).send(size.toString());
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({ message: `Failed to fetch challans` });
    }
    
}

// Get all the details related to challan for particular customer
exports.findAndGetChallanDetails = async(req,res)=>{
    const id = new mongoose.Types.ObjectId(req.params.id);

    const challanDetails = await Challan.aggregate([
        {
            $match : {
                payment_status: false,
                customer_id: id
            }
        },
        {   
            $group: {
                _id: {
                    issue_date: '$issue_date',
                    customer_id: '$customer_id',
                    item_id: '$item_id'
                },
                totalQuantity: { $sum: '$quantity' }
            }   
        },
        {
            $lookup: {
                from: 'items', // Assuming the collection name is 'items'
                localField: '_id.item_id',
                foreignField: '_id',
                as: 'items'
            }
        },
        {
            $unwind: '$items'
        },
        {   
            $project: {
                _id: 0,
                customer_id: '$_id.customer_id',
                issue_date: '$_id.issue_date',
                totalQuantity: 1,
                item_id: '$items._id',
                item_Name: '$items.Name',
                item_selling_price: '$items.selling_price'
            }
        },
        {
            $group: {
                _id: '$issue_date',
                
                itemList: {
                    $push: {
                        totalQuantity: '$totalQuantity',
                        item_id: '$item_id',
                        customer_id: '$customer_id',
                        item_Name: '$item_Name',
                        item_selling_price: '$item_selling_price',
                        subtotal: {$multiply: ['$item_selling_price', '$totalQuantity']}
                    }
                },
                totalSales: { $sum: {$multiply: ['$item_selling_price', '$totalQuantity']}},
                customer_id: { $first: '$customer_id' }
            }
        },
        {
            $sort: {
                issue_date: 1
            }
        }
    ]);
    res.status(200).send(challanDetails);
}

exports.customerWisePendingAmount = async(req,res)=>{
    const id = new mongoose.Types.ObjectId(req.params.id);

    const pendingAmount = await Challan.aggregate([
        {
            $match : {
                payment_status: false,
                customer_id: id
            }
        },
        {   
            $group: {
                _id: {
                    issue_date: '$issue_date',
                    customer_id: '$customer_id',
                    item_id: '$item_id'
                },
                totalQuantity: { $sum: '$quantity' }
            }   
        },
        {
            $lookup: {
                from: 'items', // Assuming the collection name is 'items'
                localField: '_id.item_id',
                foreignField: '_id',
                as: 'items'
            }
        },
        {
            $unwind: '$items'
        },
        {
            $group: {
                _id: '',
                totalAmount: { $sum: {$multiply: ['$items.selling_price', '$totalQuantity']}}
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);

    return res.status(200).json(pendingAmount);
}

//Post Request challan
exports.addChallan = async(req,res) => {
    try{
        const challanObject = new Challan(req.body);

        const resChallan = await challanObject.save();

        res.status(200).json(resChallan);
    }
    catch (error) {
        return res.status(500).send({
            message:
            error.message || "some error occured while creating the customer",
        });
    }
    
}

// Mark status of the challan as paid for particular customer
exports.UpdateChallan = async(req,res) => {
    const id = req.params.id;
    
    try{
        const result = await Challan.updateMany(
            {customer_id: id},
            {payment_status: true},
            { new: true }
        );
        const totalCount = result.modifiedCount;

        res.status(200).json({
            data: result, 
            message: `Updated ${totalCount} row(s)`
        });

    }
    catch(error){
        return res.status(500).send(err.mesage);
    }
}

// Generating Challan PDF
exports.GenerateChallanPDF = async(req,res) => {
    const {inputFields, customer_id} = req.body;

    const challansToInsert = [];

    inputFields.map((row, index) => {
        challansToInsert.push({
            customer_id: customer_id,
            item_id: row.item_id,
            quantity: row.quantity
        });
    });
    await Challan.insertMany(challansToInsert).then(function (result) {
        const ids = [];
        result.map((entry)=>{
            ids.push(entry._id);
        });
        
        Challan.find({ _id: { $in: ids } })
            .populate({path: 'customer_id', select: 'Name'})
            .populate({path: 'item_id', select: 'Name selling_price'})
        .then(async(records) => {
            console.log('Matching records:', records);
            const filePath = `challan_${records[0]._id}.pdf`;
            try{
                await GenerateChallanPDFFromTemplate(records, filePath);
            }
            catch(err){
                console.log(err);
            }

            res.status(200).json({
                message: "PDF stored successfully",
                url: filePath,
                data: records
            });
        })
        .catch(err => {
            console.error('Error fetching records:', err);
        });

    }).catch(function (error) {
        console.log(error)     // Failure 
    }); 
}


async function GenerateChallanPDFFromTemplate(inputData, filePath) {
    const browser = await puppeteer.launch({ 
        executablePath: '/usr/bin/chromium', 
        headless: "new", args: ['--no-sandbox'],
     });

     /* without docker configuration
    const browser = await puppeteer.launch({  
        headless: "new"}); */
    const page = await browser.newPage();
    console.log(inputData);
    const reportHTML = pdfTemplate(inputData);

    await page.setContent(reportHTML);

    // Generate PDF for the report
    await page.pdf({ path: filePath, format: "A4" });

    await browser.close();
}

// Downloading Generated PDF
exports.DownloadChallanPDF = async(req,res) => {
    const path = `${__basedir}/${req.params.filename}`;
    console.log(path);
  if(!fs.existsSync(path)){
    res.status(400).json({
      message: "File doesn't exist"
    });
  }
  var data = fs.readFileSync(path);

  fs.unlink(path, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return;
    }
  
    console.log(`File ${path} has been successfully removed.`);
  });
  
  res.contentType("application/pdf");
  res.send(data);
}
