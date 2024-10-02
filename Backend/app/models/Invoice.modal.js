const { default: mongoose } = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  // billNumber: {
  //   type: Number,
  // },
  customer_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    require: true
  },
  invoiceItem: [
    {
      item_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
    },
  ],
  // payableAmount: {
  //   type: Number,
  //   require: true
  // },
  issue_date: {
    type: String,
    require: true,
    default: () => {
      var result="";
      var d = new Date();
      result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate();
      return result;
    }
  },
  isPaid: {
    type: Boolean,
    require: true,
    default: false
  }
});

const Invoice = mongoose.model('invoice', invoiceSchema);

module.exports = Invoice;



// 1 Invoice has multiple items
// Associate InvoiceItem with item object
// quantity
