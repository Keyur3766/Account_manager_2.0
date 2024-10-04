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

// module.exports = (sequelize, Sequelize) => {
//     const Challans = sequelize.define("challan", {
//       challan_id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       customer_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       item_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       quantity: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       payment_status: {
//         type:Sequelize.BOOLEAN,
//         defaultValue: false,
//       },
//       issue_date: {
//         type: Sequelize.DATEONLY,
//         allowNull: false,
//         defaultValue: Sequelize.NOW
//       }
//     });
  
//     return Challans;
// };