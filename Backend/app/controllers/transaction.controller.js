const Joi = require("joi"); 

const db = require("../models");
const Sequelize = require('sequelize');
const Transactions = db.Transaction;

exports.AddTransaction = async(req,res) => {
    const transaction = {
        customer_id: req.body.customer_id,
        amount: req.body.amount,
        purpose: req.body.purpose
    }

    await Transactions.create(transaction)
    .then((data)=>{
        res.send(data);
    })
    .catch((err)=>{
        res.status(500).send({
            message: err.message || "some error occured while adding transaction"
        });
    });
}

exports.GetTransactionByID = async(req,res) => {
    const id = req.params.id;
    console.log(id);
    const data = await Transactions.findAll({
        where: {
            customer_id: id
        },
        include: [
            {
                model: db.customer,
                attributes: ["Name"]
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    });
    res.status(200).send(data);
}

exports.GetCustomerswithTransactionAmount = async(req,res) => {
    const id = req.params.id;
    const data = await Transactions.findOne({
        attributes: ['customer_id', [Sequelize.fn('SUM', Sequelize.col('amount')), 'total']],
        where: {
            customer_id: id
        },
        group: [
            'customer_id'
        ]
    });
    res.status(200).send(data);
}