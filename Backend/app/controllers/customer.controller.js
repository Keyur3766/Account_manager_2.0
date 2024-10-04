const Customer = require("../models/customer.modal");

//Get Request Customer
exports.GetCustomers = async (req, res) => {
  try{
    const data = await Customer.find();
    // console.log(Object.keys(data).length);
    res.status(200).json(data);
  }
  catch(err){
    res.status(500).json({ message: `Failed to fetch customers from the Database`});
  }
};

//Get customer by Id
exports.GetCustomerById = async (req, res) => {
  const customer_id = req.params.id;
  try {
    // Fetch item by item ID from the database
    const customer = await Customer.findOne({_id :customer_id});

    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
    }

    // Extract item name from the retrieved item
    const customerName = customer.Name;
    // Return item name as JSON response
    res.status(200).json({ customerName });
  } catch (error) {
    // Handle error
    res.status(500).json({ message: `Failed to fetch customer name: ${error.message}` });
  }
};

//Post Request Customer
exports.addCustomer = async (req, res) => {
  const customer = new Customer(req.body);
  if (!customer) {
    res.status(400).send("Please Provide the input");
    return;
  }
  // Check if user already exist
  await Customer.findOne({ Email: customer.Email })
    .then((data) => {
      if (data) {
        res.status(456).send({
          message: "Customer with same EmailId already exist",
        });
        return;
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving while entering the data into database=",
      });
    });

    // Save customer details
    await customer.save()
        .then((data) => {
          res.send(data);
        })  
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "some error occured while creating the customer",
          });
        });
};

exports.Delete_Customer = async (req, res) => {
  const id = req.params.id;
  try{
    const response  = await Customer.deleteOne({_id: id});
    if(response.deletedCount == 1){
      res.status(200).send({
        message: "Customer was deleted successfully!",
      });
    }
    else{
      res.status(500).send({
        message: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`,
      });
    }
  }
  catch(error){
    res.status(500).send({
      message: `Error occured while deleting the record: ${error.message}`,
    });
  }
  
};
