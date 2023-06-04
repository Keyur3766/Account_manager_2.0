//Used for validation in Node.js
const Joi = require("joi"); 
const pdf = require('html-pdf');
const pdfTemplate = require("../documents/index");
const db = require("../models");
const Sequelize = require('sequelize');


const Challans = db.challans;

// //Get Request Customer
// exports.GetCustomers = async(req,res) => {
//     const data = await Customer.findAll();
    
//     res.status(200).send(data);
// }


// Get pending challan count
exports.findAndGetChallans = async(req,res)=>{
    const id = req.params.id;
    console.warn(id);
    const data = await Challans.count({
        attributes: [
            'customer_id', 'issue_date',[Sequelize.fn('COUNT', 'challan_id'), 'count']
        ],
        where: {
            payment_status:'false',
            customer_id: id
        },
        group: ['customer_id','issue_date']
    });

    const size = Object.keys(data).length;
    
    res.status(200).send(size.toString());
}

// Get all the details related to challan for particular customer
exports.findAndGetChallanDetails = async(req,res)=>{
    const id = req.params.id;
    console.warn(id);
    const data = await Challans.findAll({
        attributes: ["customer_id","issue_date", [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']],
        where: {
            payment_status:'false',
            customer_id: id
        },
        include: [
            {
                model: db.items,
                attributes: ["id","Name","selling_price"]
            }  
        ],
        group: ['issue_date','customer_id','item.id'],
        order: [
            ['issue_date', 'ASC']
        ]
    });
    res.status(200).send(data);
}



//Post Request challan
exports.addChallan = async(req,res) => {
    
    const{
        customer_id,
        item_id,
        quantity,
    } = req.body;

    const challan = {
        customer_id: req.body.customer_id,
        item_id: req.body.item_id,
        quantity: req.body.quantity,
    }

    Challans.create(challan)
    .then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.status(500).send({
            message: err.message || "some error occured while creating the challan"
        });
    });
}

// Mark status of the challan as paid for particular customer

exports.UpdateChallan = async(req,res) => {
    const id = req.params.id;
    console.warn(id);
    
    Challans.update({payment_status: true}, {where: {customer_id: id}})
    .then(numAffectedRows => {
        res.status(200).send(`Updated ${numAffectedRows} row(s)`);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send("Something went wrong");
    });
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
