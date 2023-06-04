module.exports = (sequelize, Sequelize) => {
    const InvoiceItem = sequelize.define("invoice_item", {
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
    }); 

    return InvoiceItem;
}