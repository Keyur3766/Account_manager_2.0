const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.customer = require("./customer.modal")(sequelize,Sequelize);
db.supplier = require("./supplier.modal")(sequelize,Sequelize);
db.items = require("./items.modal")(sequelize,Sequelize);
db.challans = require("./challans.modal")(sequelize,Sequelize);
db.Invoice = require("./Invoice.modal")(sequelize,Sequelize);
db.InvoiceItem = require("./invoiceItem.modal")(sequelize,Sequelize);
db.User = require("./users.modal")(sequelize,Sequelize);
db.Transaction = require("./transaction.modal")(sequelize,Sequelize);


//challans customer relation
db.customer.hasMany(db.challans, {foreignKey: "customer_id"});
db.challans.belongsTo(db.customer, {foreignKey: "customer_id"});

//challan item relation
db.items.hasMany(db.challans, {foreignKey: "item_id"});
db.challans.belongsTo(db.items, {foreignKey: "item_id"});

//transaction customer relation
db.customer.hasMany(db.Transaction, {foreignKey: "customer_id"});
db.Transaction.belongsTo(db.customer, {foreignKey: "customer_id"});


// Invoice associations
db.items.belongsToMany(db.Invoice, { through: db.InvoiceItem });
db.Invoice.belongsToMany(db.items, { through: db.InvoiceItem });
db.Invoice.belongsTo(db.customer);


module.exports = db;