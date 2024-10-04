// module.exports = (sequelize, Sequelize) => {
//     const Transactions = sequelize.define("transaction", {
//       transaction_id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       customer_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
//       amount: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//       },
      
//       purpose: {
//         type:Sequelize.TEXT,
//       },
//       date: {
//         type: Sequelize.DATEONLY,
//         allowNull: false,
//         defaultValue: Sequelize.NOW
//       },
//     });
  
//     return Transactions;
// };
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
