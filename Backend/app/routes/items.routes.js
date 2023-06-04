const itemsController = require("../controllers/items.controller");
const {addItems, getItemImage, getItems, Delete_Item, getItemById, UpdateStockIns,UpdateStockOUTs} = itemsController;
const upload = require("../middleware/upload");
const express = require("express");
const authenticate = require("../middleware/authenticate");
var router = express.Router();

// router.use(express.json())
// router.use(express.urlencoded({ extended: true }));
//Get Customers
// router.get("/getCustomers",GetCustomers);

//Post (Create new Item)
router.post("/addItems",upload.single("file"),addItems);

router.get("/image/:filename", getItemImage);

router.get("/getItems",authenticate,getItems);

//Delete Item
router.delete("/getItems/:id",Delete_Item);

// Get item name by Id
router.get("/getItemById/:item_id", getItemById);

// Add stocks for particular id
router.put("/updateStockIn/:item_id",UpdateStockIns);

// remove stocks for particular id
router.put("/updateStockOUT/:item_id",UpdateStockOUTs);

module.exports = router;