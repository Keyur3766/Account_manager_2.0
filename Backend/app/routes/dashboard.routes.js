const dashboardController = require("../controllers/dashboard.controller");
const {PendingAmounts, Estimated_Profit, MonthlySales, TotalCustomers } = dashboardController;


var router = require("express").Router();

//Get PendingAmount
router.get("/PendingAmount",PendingAmounts);

//Get profit
router.get("/EstimatedProfit",Estimated_Profit);

// sum of invoice amount
router.get("/MonthlySales", MonthlySales);

router.get("/totalCustomers", TotalCustomers);

module.exports = router;