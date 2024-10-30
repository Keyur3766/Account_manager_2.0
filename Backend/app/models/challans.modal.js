const mongoose = require("mongoose");

const challanSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  quantity: {
    type: Number,
    require: true
  },
  payment_status: {
    type:Boolean,
    default: false,
  },
  issue_date: {
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

const Challan = mongoose.model('challan', challanSchema);

module.exports = Challan;