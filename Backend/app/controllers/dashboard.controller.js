
const db = require("../models");
const { sequelize, Sequelize } = require('sequelize');

const Challan = db.challans;
const Item = db.items;

exports.PendingAmounts = async(req,res) => {
    const rawQuery = `
          SELECT SUM(items.selling_price * challans.quantity) AS total_amount
          FROM challans
          JOIN items ON challans.item_id = items.id WHERE challans.payment_status=false;    
    `;

    db.sequelize.query(rawQuery, { type: db.sequelize.QueryTypes.SELECT })
      .then(result => {
        const totalAmount = result[0].total_amount;
        const multipliedAmount = Math.round(totalAmount * 1.18);
        res.send(String(multipliedAmount));
      })
      .catch(err => {
        console.error('Error:', err);
        res.sendStatus(500);
      });   
}

exports.Estimated_Profit = async(req,res) => {
  const rawQuery = `
        SELECT SUM((items.selling_price-items.purchase_price) * challans.quantity) AS total_amount
        FROM challans
        JOIN items ON challans.item_id = items.id WHERE challans.payment_status=false;    
  `;

  db.sequelize.query(rawQuery, { type: db.sequelize.QueryTypes.SELECT })
    .then(result => {
      const totalAmount = result[0].total_amount;
      const multipliedAmount = Math.round(totalAmount * 1.18);
      res.send(String(multipliedAmount));
    })
    .catch(err => {
      console.error('Error:', err);
      res.sendStatus(500);
    });   
}

exports.MonthlySales = async(req,res) => {
  db.Invoice.sum('total_amount').then((sum)=> {
    res.send(String(sum));
  }).catch((error) => {
    console.error('Error:', error);
  });
}

exports.TotalCustomers = async(req,res) => {
  db.customer.count().then((count)=> {
    res.send(String(count));
  }).catch((error) => {
    console.error('Error:', error);
  });
}
