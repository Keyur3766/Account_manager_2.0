//Used for validation in Node.js
const Joi = require("joi"); 
const pdf = require('html-pdf');
// const puppeteer = require('puppeteer');
const pdfTemplate = require("../documents/InvoiceTemplate/index");
const db = require("../models");
const path = require('path');

const Customer = db.customer;
const Invoice = db.Invoice;
const Item = db.items;



// const phantomPath = path.join(__dirname, '..','..','node_modules', 'phantomjs-2.1.1-macosx', 'bin','phantomjs');
const phantomPath = path.join(__dirname, '..','phantomjs-2.1.1-macosx', 'bin','phantomjs');
var options = {
  phantomPath: phantomPath
};

exports.generateInvoice = async (req, res) => {
    try {
        const { customerId, items } = req.body;
    
        // create the invoice
        const invoice = await db.Invoice.create({
          total_amount: 0, // initialize total amount to 0
          customerId, // set the customer ID for this invoice
        });
    
        var ans = 0;
        // add items to the invoice
        const invoiceItems = await Promise.all(items.map(async (item) => {
          const { item_id, quantity } = item;
    
          // get the item from the database
          const dbItem = await Item.findByPk(item_id);
          
          ans += dbItem.selling_price * quantity

          // create a new invoice item with the quantity and calculated price
          return await db.InvoiceItem.create({
            quantity,
            price: dbItem.selling_price * quantity,
            itemId: item_id,
            invoiceId: invoice.id,
          });
        }));
        
        // ans = ans
        // update the invoice with the total amount
        await invoice.update({ total_amount: ans });
    
        // return the created invoice
        const response = await Invoice.findOne({
            where: { id: invoice.id },
            include: [
              {
                model: Item,
                attributes: ['id', 'Name', 'selling_price'],
                through: { attributes: ['quantity'] },
              },

              {
                model: Customer,
                attributes: ['Name','Email','Address','City']
              }
            ],
          });
          
          // (async () => {
          //   const browser = await puppeteer.launch({
          //     headless: true,
          //      args: ['--no-sandbox', '--disable-setuid-sandbox']
          //     });
          //   const page = await browser.newPage();
          //   await page.setContent(pdfTemplate(response)); // render the HTML template
            

          //   await page.pdf({ // generate the PDF file
          //     path: `${__dirname}/invoice.pdf`,
          //     format: 'A4',
          //     margin: {
          //       top: '20mm',
          //       right: '20mm',
          //       bottom: '20mm',
          //       left: '20mm'
          //     }
          //   });
          
          //   console.log('PDF generated');
          //   res.status(201).json(response);
          
          //   await browser.close();
          // })();
          
          
          // (async () => {
          //   const browser = await puppeteer.launch();
          //   const page = await browser.newPage();
            
          //   // Replace pdfTemplate(response) with your HTML string or file path
          //   await page.setContent(pdfTemplate(response));
            
          //   // Generate PDF
          //   await page.pdf({ path: `${__dirname}/invoice.pdf`, format: 'Letter' });
            
          //   console.log('PDF generated');
            
          //   await browser.close(); 
          // })();

          pdf.create(pdfTemplate(response),options).toFile(`${__dirname}/invoice.pdf`, (err) => {
            if(err){
                // res.send(Promise.reject());
                // return;

                console.warn(err);
                res.status(500).send("Error generating PDF");
                return Promise.reject();
            }
            console.log("pdf generated");

            res.status(201).json(response);
          });

          // res.sendFile(`${__dirname}/invoice.pdf`);
          
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


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

// Downloading Generated PDF
exports.DownloadInvoicePDF = async(req,res) => {
  console.log("Pdf downloading");
  console.warn(`${__dirname}`);
  res.sendFile(`${__dirname}/invoice.pdf`);
}






  