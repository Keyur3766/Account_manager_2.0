const challanController = require("../controllers/challans.controller");
const {addChallan, findAndGetChallans, findAndGetChallanDetails,GenerateChallanPDF, DownloadChallanPDF, UpdateChallan} = challanController;




var router = require("express").Router();

//Get Challan count
router.get("/getChallanCount/:id",findAndGetChallans);

//Get challan details
router.get("/getChallanDetails/:id",findAndGetChallanDetails);

//Post (Create new challan)
router.post("/addChallans",addChallan);

// Generate PDF POST
router.post('/createChallanPDF',GenerateChallanPDF);

// Get Challan PDF
router.get("/fetchPDF", DownloadChallanPDF);

// Mark the challan as paid for the particular customer
router.put("/updateChallan/:id", UpdateChallan);

//Delete Customer
// router.delete("/deleteCustomers/:id",Delete_Customer);

module.exports = router;