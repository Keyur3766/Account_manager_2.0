//Used for validation in Node.js
const Joi = require("joi");
const path = require("path");

const db = require("../models");
const fs = require("fs");

const Item = db.items;

//Get all the Items from DB
exports.getItems = async (req, res) => {
  try {
    // console.log("From API:");
    const items = await Item.findAll({order: [
      ['total_stocks', 'DESC'],
    ]})
      .then((items) => {
        items.map((i) => {
          const itemimage = i.imageData.toString("base64");
          i["imageData"] = itemimage;
        });
        return items;
      })
      .then((items) => {
        return res.status(200).send(items);
      });
  } catch (error) {
    return res.status(500).send(error.mesage);
  }
};




// Get ItemName by Id
exports.getItemById = async (req,res) => {
  const itemId = req.params.item_id;
  try {
    // Fetch item by item ID from the database
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Extract item name from the retrieved item
    const itemName = item.Name;
    const selling_price = item.selling_price;
    // Return item name as JSON response
    res.json({ itemName, selling_price });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch item name' });
  }

}


// Manage stock INs
exports.UpdateStockIns = async(req,res) => {
  const itemId = req.params.item_id;

  const quant = req.body.quantity;
  try{
    // Fetch item by item ID from the database
    const item = await Item.findByPk(itemId);
    item.total_stocks += parseInt(quant,10);

    await item.save();

    res.status(200).send("stock added successfully");
  }
  catch(err){
    return res.status(500).send(err.mesage);
  }
}

// Manage stock INs
exports.UpdateStockOUTs = async(req,res) => {
  const itemId = req.params.item_id;

  const quant = req.body.quantity;
  try{
    // Fetch item by item ID from the database
    const item = await Item.findByPk(itemId);
    item.total_stocks -= parseInt(quant,10);

    await item.save();

    res.status(200).send("stock deleted successfully");
  }
  catch(err){
    return res.status(500).send(err.mesage);
  }
}



//Get Item Image
exports.getItemImage = async (req, res) => {
  const { filename } = req.params;

  const fullfilepath = path.join(
    __basedir,
    "/resources/static/assets/temps/" + filename
  );
  return res.sendFile(fullfilepath);
};

//Post Request Item
exports.addItems = async (req, res) => {
  try {
    console.log(req.file);

    if (req.file == undefined) {
      return res.send("You must select a file");
    }

    const Name = req.body.Name;

    Item.findOne({ where: { Name: Name } }).then((data) => {
      if (data) {
        res.status(456).send({
          message: "Product with same Name already exist",
        });
        res.end();
        return;
      }
      const my_item = {
        Name: req.body.Name,
        purchase_price: req.body.purchase_price,
        selling_price: req.body.selling_price,
        item_color: req.body.item_color,
        total_stocks: req.body.total_stocks,

        //For images
        imageType: req.file.mimetype,
        imageName: req.file.originalname,
        imageData: fs.readFileSync(
          __basedir + "/resources/static/assets/uploads/" + req.file.filename
        ),
      };

      Item.create(my_item)
        .then((image) => {
          // console.log(image);
          fs.writeFileSync(
            __basedir + "/resources/static/assets/temps/" + image.imageName,
            image.imageData
          );

          return res.send(`File has been uploaded.`);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "some error occured while creating the Item",
          });
        });
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

exports.Delete_Item = (req, res) => {
const id = req.params.id;

  Item.destroy({
    where: { id: id },
  })
  .then((num) => {
    if (num == 1) {
      res.send({
        message: "Item was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete Item with id=${id}. Maybe Item was not found!`,
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Could not delete Item with id=" + id,
    });
})};
