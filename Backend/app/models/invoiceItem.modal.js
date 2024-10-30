const mongoose = require("mongoose");


const invoiceItemSchema = mongoose.Schema({
  item_id: {
    type: mongoose.Types.ObjectId,

  }
});

const InvoiceItem = mongoose.model('InvoiceItem', invoiceItemSchema);

module.exports = InvoiceItem;
