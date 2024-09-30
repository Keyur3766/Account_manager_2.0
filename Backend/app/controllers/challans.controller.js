//Used for validation in Node.js
const Joi = require("joi"); 
const pdf = require('html-pdf');
const pdfTemplate = require("../documents/index");
const db = require("../models");
const Sequelize = require('sequelize');
const Challan = require("../models/challans.modal");
const mongoose = require("mongoose");

const Challans = db.challans;

// //Get Request Customer
// exports.GetCustomers = async(req,res) => {
//     const data = await Customer.findAll();
    
//     res.status(200).send(data);
// }


// Get pending challan count
exports.findAndGetChallans = async(req,res)=>{
    let id = new mongoose.Types.ObjectId(req.params.id);
    // const data = await Challans.count({
    //     attributes: [
    //         'customer_id', 'issue_date',[Sequelize.fn('COUNT', 'challan_id'), 'count']
    //     ],
    //     where: {
    //         payment_status:'false',
    //         customer_id: id
    //     },
    //     group: ['customer_id','issue_date']
    // });

    // const size = Object.keys(data).length;
    
    // res.status(200).send(size.toString());
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

    // const data = await Challans.findAll({
    //     attributes: ["customer_id","issue_date", [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']],
    //     where: {
    //         payment_status:'false',
    //         customer_id: id
    //     },
    //     include: [
    //         {
    //             model: db.items,
    //             attributes: ["id","Name","selling_price"]
    //         }  
    //     ],
    //     group: ['issue_date','customer_id','item.id'],
    //     order: [
    //         ['issue_date', 'ASC']
    //     ]
    // });



    // Sample Output
    // {
    //     "_id": "2024/1/27",
    //     "itemList": [
    //         {
    //             "totalQuantity": 130,
    //             "item_id": "65ad438af07c7f3e3d008c25",
    //             "customer_id": "65ad438af07c7f3e3d008c25",
    //             "item_Name": "Item4",
    //             "item_selling_price": 20
    //         }
    //     ],
    //     "totalSales": 20,
    //     "customer_id": "65ad438af07c7f3e3d008c25"
    // },
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
        console.warn(req.body);
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
    // const {inputFields} = req.body;

    pdf.create(pdfTemplate(req.body),{}).toFile(`${__dirname}/result.pdf`, (err) => {
        if(err){
            res.send(Promise.reject());
        }
        console.log("pdf generated");
        res.send(Promise.resolve());
    });
}

// Downloading Generated PDF
exports.DownloadChallanPDF = async(req,res) => {
    console.log("Pdf downloading");
    console.warn(`${__dirname}`);
    res.sendFile(`${__dirname}/result.pdf`);
}
