const Supplier = require('../models/supplier.modal');

//Get Request Customer
exports.GetSuppliers = async(req,res) => {
    try{
        const data = await Supplier.find();
        res.status(200).send(data);
    }
    catch(err){
        res.status(500).json({ message: `Failed to fetch suppliers from DB`});
    }
}



//Post Request Customer
exports.addSupplier = async(req,res) => {
  const supplier = new Supplier(req.body);

  if (!supplier) {
    res.status(400).send("Please provide inputs");
  }

  // Check if user already exist
  await Supplier.findOne({ Email: supplier.Email })
    .then((data) => {
      if (data) {
        res.status(456).send({
          message: "Supplier with same EmailId already exist",
        });
        return;
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving while entering the data into database=",
      });
    });

  // Save customer details
  await supplier
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "some error occured while creating the customer",
      });
    });
}


//Delete Supplier
exports.Delete_Supplier = async (req, res) => {
    const id = req.params.id;
    try{
        const response  = await Supplier.deleteOne({_id: id});
        if(response.deletedCount == 1){
        res.status(200).send({
            message: "Customer was deleted successfully!",
        });
        }
        else{
        res.status(500).send({
            message: `Cannot delete supplier with id=${id}. Maybe supplier was not found!`,
        });
        }
    }
    catch(error){
        res.status(500).send({
        message: `Error occured while deleting the record: ${error.message}`,
        });
    }
};