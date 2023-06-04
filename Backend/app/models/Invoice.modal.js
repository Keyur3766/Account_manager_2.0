module.exports = (sequelize,Sequelize)=>{
    const Invoice = sequelize.define("invoice", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        total_amount: {
          type: Sequelize.INTEGER,
          allowNull: false,
        }
    });

    return Invoice;
}