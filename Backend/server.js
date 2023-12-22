//importing modules
const express = require('express')
const bodyParser = require("body-parser");
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cors = require("cors");
const cookieParser = require("cookie-parser")
const customerRoutes = require("./app/routes/customers.routes");
const supplierRoutes = require("./app/routes/suppliers.routes");
const itemRoutes = require("./app/routes/items.routes");
const challanRoutes = require("./app/routes/challans.routes");
const invoiceRoutes = require("./app/routes/invoice.routes");
const loginRoutes = require("./app/routes/login.routes");
const transactionRoutes = require("./app/routes/transaction.routes");
const dashboardRoutes = require("./app/routes/dashboard.routes");
global.__basedir = __dirname;


//setting up your port
const PORT = process.env.PORT || 8081

//assigning the variable app to express
const app = express()




//middleware
app.use(cors());
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
// db.sequelize.sync();

// synchronizing the database and forcing it to false so we dont lose data
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("db has been re sync");
// });
app.use("/api/customers/", customerRoutes);
app.use("/api/suppliers/",supplierRoutes);
app.use("/api/items/",itemRoutes);
app.use("/api/challans/",challanRoutes);
app.use("/api/invoice/",invoiceRoutes);
app.use("/api/login/", loginRoutes);
app.use("/api/transactions/", transactionRoutes);
app.use("/api/dashboard/", dashboardRoutes);


//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))


