module.exports = (sequelize, Sequelize) => {
    const Items = sequelize.define("item", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      selling_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      purchase_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_color: {
        type: Sequelize.STRING,
      },
      total_stocks: {
        type:Sequelize.INTEGER,
        allowNull: false
      },
      imageType: {
        type: Sequelize.STRING
      },
      imageName: {
        type: Sequelize.STRING
      },
      imageData: {
        type: Sequelize.BLOB('long')
      }
    });
  
    return Items;
};