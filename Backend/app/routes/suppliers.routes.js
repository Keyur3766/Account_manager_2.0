const supplierController = require("../controllers/supplier.controller");
const {addSupplier,GetSuppliers, Delete_Supplier} = supplierController;
const authenticate = require("../middleware/authenticate");



var router = require("express").Router();

//Get Customers
router.get("/getSuppliers",authenticate, GetSuppliers);

//Post (Create new customer)
router.post("/addSupplier",addSupplier);

//Delete Supplier
router.delete("/deleteSuppliers/:id",Delete_Supplier);


module.exports = router;