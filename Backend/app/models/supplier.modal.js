module.exports = (sequelize, Sequelize) => {
    const Supplier = sequelize.define("supplier", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      City: {
        type:Sequelize.STRING,
        allowNull: false
      },
      Mobile: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    });
  
    return Supplier;
};