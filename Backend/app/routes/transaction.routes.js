const transactionController = require("../controllers/transaction.controller");
const { AddTransaction, GetTransactionByID, GetCustomerswithTransactionAmount } = transactionController;

var router = require("express").Router();

//Add transaction
router.post("/addTransaction",AddTransaction);

// Get Customer wise transaction
router.get("/getTransactionById/:id", GetTransactionByID)

// Get Transaction amount customerwise
router.get("/getTransactionAmountById/:id",GetCustomerswithTransactionAmount);

module.exports = router;