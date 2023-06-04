const invoiceController = require("../controllers/invoice.controller");
const {generateInvoice, DownloadInvoicePDF} = invoiceController;

var router = require("express").Router();

// Create Invoice
router.post("/generateInvoice", generateInvoice);

// Generate PDF POST
// router.post('/createInvoicePDF',GenerateInvoicePDF);

// Download Invoice PDF
router.get("/fetchPDF", DownloadInvoicePDF);

module.exports = router;