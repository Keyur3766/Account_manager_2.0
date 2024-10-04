//Used for validation in Node.js
const Joi = require("joi");
const pdf = require("html-pdf");
const fs = require('fs')
// const puppeteer = require('puppeteer');
const pdfTemplate = require("../documents/InvoiceTemplate/index");
const db = require("../models");
const path = require("path");
const InvoiceModel = require("../models/Invoice.modal");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");


const Customer = db.customer;
const Invoice = db.Invoice;
const Item = db.items;

// const phantomPath = path.join(__dirname, '..','..','node_modules', 'phantomjs-2.1.1-macosx', 'bin','phantomjs');
const phantomPath = path.join(
  __dirname,
  "..",
  "phantomjs-2.1.1-macosx",
  "bin",
  "phantomjs"
);
var options = {
  phantomPath: phantomPath,
};

exports.generateInvoice = async (req, res) => {
  try {
    const invoiceObject = new InvoiceModel(req.body);

    const resInvoiceSave = await invoiceObject.save();

    if(!resInvoiceSave){
      res.status(500).send({
        message:
          error.message || "some error occured while creating the Invoice",
      });
    }

    const response = await InvoiceModel.findOne({ _id: resInvoiceSave._id })
      .populate({path: 'customer_id', select: 'Name Address City Mobile Email'})
      .populate({path: 'invoiceItem.item_id', select: 'Name selling_price'});

    const filePath = `invoice_${response._id}.pdf`;
    try{
      await GenerateInvoicePDF(response, filePath);
    }
    catch(err){
      console.log(err);
    }
    
    
    res.status(200).json({
      message: "PDF stored successfully",
      url: filePath,
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error.message || "some error occured while creating the Invoice",
    });
  }
};

// Generating Challan PDF
// exports.GenerateInvoicePDF = async(req,res) => {
//   pdf.create(pdfTemplate(req.body),{}).toFile(`${__dirname}/invoice.pdf`, (err) => {
//       if(err){
//           res.send(Promise.reject());
//       }
//       console.log("pdf generated");
//       res.send(Promise.resolve());
//   });
// }

async function GenerateInvoicePDF(input, filePath) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const reportHTML = pdfTemplate(input);

  await page.setContent(reportHTML);

  // Generate PDF for the report
  await page.pdf({ path: filePath, format: "A4" });

  await browser.close();
}

// Downloading Generated PDF
exports.DownloadInvoicePDF = async (req, res) => {
  const path = `${__basedir}/${req.params.filename}`;

  if(!fs.existsSync(path)){
    res.status(400).json({
      message: "File doesn't exist"
    });
  }
  var data = fs.readFileSync(path);

  fs.unlink(path, (err) => {
    if (err) {
      console.error(`Error removing file: ${err}`);
      return;
    }
  
    console.log(`File ${path} has been successfully removed.`);
  });
  
  res.contentType("application/pdf");
  res.send(data);
};
