const mongoose = require("mongoose");


const invoiceItemSchema = mongoose.Schema({
  item_id: {
    type: mongoose.Types.ObjectId,

  }
});


// module.exports = (sequelize, Sequelize) => {
//     const InvoiceItem = sequelize.define("invoice_item", {
//         quantity: {
//           type: Sequelize.INTEGER,
//           allowNull: false,
//         }
//     }); 

//     return InvoiceItem;
// }


const InvoiceItem = mongoose.model('InvoiceItem', invoiceItemSchema);

module.exports = InvoiceItem;

// 1 Invoice has multiple items
// Associate InvoiceItem with item object
// quantity 