
const Challan = require("../models/challans.modal");
const Invoice = require("../models/Invoice.modal");
const Customer = require("../models/customer.modal");

exports.PendingAmounts = async(req,res) => {
    const pendingAmount = await Challan.aggregate([
      {
        $match : {
            payment_status: false
        }
      },
      {
        $lookup: {
            from: 'items', // Assuming the collection name is 'items'
            localField: 'item_id',
            foreignField: '_id',
            as: 'items'
        }
      },
      {
        $unwind: '$items'
      },
      {
          $group: {
              _id: null,
              totalAmount: { $sum: {$multiply: ['$items.selling_price', '$quantity']}}
          }
      },
      {
          $project: {
              _id: 0
          }
      }
  ]);

  if(!pendingAmount[0]){
    return res.status(500).json({
      message: "Internal server error"
    });
  }

  return res.status(200).json(pendingAmount[0]);
}

exports.Estimated_Profit = async(req,res) => {
  const rawQuery = `
        SELECT SUM((items.selling_price-items.purchase_price) * challans.quantity) AS total_amount
        FROM challans
        JOIN items ON challans.item_id = items.id WHERE challans.payment_status=false;    
  `;

  const EstimatedProfit = await Invoice.aggregate([
    {
      $match: {
        isPaid: true
      }
    },
    {
      $unwind: '$invoiceItem'
    },
    {
      $group: {
        _id: '$invoiceItem.item_id',
        totalQuantity: { $sum: '$invoiceItem.quantity'}
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'items'
      }
    },
    {
      $unwind: '$items'
    },
    {
      $group: {
        _id: null,
        totalEstimatedProfit: {
          $sum: {
            $multiply: [
              { $subtract: ["$items.selling_price", "$items.purchase_price"] },
              "$totalQuantity"
            ]
          }
        }
      }
    },
    {
      $project: {
          _id: 0
      }
    }
  ]);

  if(!EstimatedProfit[0]){
    return res.status(500).json({
      message: "Internal server error"
    });
  }

  return res.status(200).json(EstimatedProfit[0]);
}

exports.MonthlySales = async(req,res) => {
  const monthlySales = await Invoice.aggregate([
    {
      $unwind: '$invoiceItem'
    },
    {
      $group: {
        _id: '$invoiceItem.item_id',
        totalQuantity: { $sum: '$invoiceItem.quantity'}
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'items'
      }
    },
    {
      $unwind: '$items'
    },
    {
      $group: {
        _id: null,
        totalMonthlysales: {
          $sum: {
            $multiply: [
              "$items.selling_price",
              "$totalQuantity"
            ]
          }
        }
      }
    },
    {
      $project: {
          _id: 0
      }
    }
  ]);

  if(!monthlySales[0]){
    return res.status(500).json({
      message: "Internal server error"
    });
  }

  return res.status(200).json(monthlySales[0]);
}

exports.TotalCustomers = async(req,res) => {
  const totalCustomer = await Customer.countDocuments();

  res.status(200).json({
    totalCustomer: totalCustomer
  });
}
