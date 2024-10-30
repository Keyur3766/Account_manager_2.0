const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  amount: {
    type: Number,
    require: true
  },
  purpose: {
    type:String
  },
  date: {
    type: String,
    require: true,
    default: () => {
      var result="";
      var d = new Date();
      result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate();
      return result;
    }
  }
}); 

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;
