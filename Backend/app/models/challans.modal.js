module.exports = (sequelize, Sequelize) => {
    const Challans = sequelize.define("challan", {
      challan_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      payment_status: {
        type:Sequelize.BOOLEAN,
        defaultValue: false,
      },
      issue_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
    });
  
    return Challans;
};