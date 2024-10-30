const mangoose = require("mongoose");

const customerSchema = new mangoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Address: {
    type: String,
    require: true,
  },
  City: {
    type: String,
    require: true,
  },
  Mobile: {
    type: Number,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v.toString()); // Regular expression to match exactly 10 digits
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    },
    required: [true, 'Mobile number is required']
  },
});

const Customer = mangoose.model('Customer', customerSchema);

module.exports = Customer;