const mangoose = require("mongoose");

const itemSchema = new mangoose.Schema({
  Name: {
    type: String,
    require: true
  },
  selling_price: {
    type: Number,
    require: true
  },
  purchase_price: {
    type: Number,
    require: true
  },
  item_color: {
    type: String,
    require: false
  },
  total_stocks: {
    type: Number,
    require: true
  },
  image: {
    type: {
      imageType: {
        type: String,
        require: true
      },
      imagePath: {
        type: String,
        require: true
      },
      imageName: {
        type: String,
        require: true
      },
      imageData: {
        type: Buffer
      }
    }
  }
});

const Product = mangoose.model('Item', itemSchema);

module.exports = Product;