const customerController = require("../controllers/customer.controller");
const {addCustomer,GetCustomers, Delete_Customer,GetCustomerById} = customerController;
const authenticate = require("../middleware/authenticate");




var router = require("express").Router();


//Get Customers
router.get("/getCustomers",authenticate,GetCustomers);

//Get Customer By ID
router.get("/getCustomers/:id", GetCustomerById);

//Post (Create new customer)
router.post("/addCustomer",addCustomer);

//Delete Customer
router.delete("/deleteCustomers/:id",Delete_Customer);

module.exports = router;