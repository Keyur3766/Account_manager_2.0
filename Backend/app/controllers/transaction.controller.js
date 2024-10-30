const Transaction = require("../models/transaction.modal");
const mongoose = require("mongoose");


exports.AddTransaction = async(req,res) => {
    const transaction = {
        customer_id: req.body.customer_id,
        amount: req.body.amount,
        purpose: req.body.purpose
    }

    try{
        const transactionObject = new Transaction(transaction);
        await transactionObject.save();
        res.status(200).json({
            message: "Transaction saved successfully"
        });
    }
    catch (error) {
        return res.status(500).send({
            message:
            error.message || "some error occured while creating the customer",
        });
    }
}

exports.GetTransactionByID = async(req,res) => {
    const id = req.params.id;

    const data = await Transaction.find({customer_id: id}).populate({
        path: 'customer_id',   
        select: 'Name'      
    })
    .sort({ createdAt: -1 });;

    res.status(200).send(data);
}

exports.GetCustomerswithTransactionAmount = async(req,res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);

    const transactions = await Transaction.aggregate([
        {
          $match: {
            customer_id: id
          }
        },
        {
          $group: {
            _id: "$customer_id",
            total: {
              $sum: "$amount"
            }
          }
        },
        {
          $project: {
              _id: 0,
              customer_id: '$_id',
              total: 1
          }
        }
      ]);
      
      if(!transactions){
        return res.status(500).json({
          message: "Internal server error"
        });
      }
    
      return res.status(200).json(transactions[0]);
}