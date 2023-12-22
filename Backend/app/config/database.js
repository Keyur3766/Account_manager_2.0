// Confuguration of the Database
const mongoose = require('mongoose');

// require("dotenv").config();
// Development
// module.exports = {
//     HOST: process.env.PGHOST,
//     USER: process.env.PGUSER,
//     PASSWORD: process.env.PGPASSWORD,
//     DB: process.env.PGDATABASE,
//     dialect: "postgres",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// };


const connect = async() => {
    const mongoConnectionString = process.env.MONGO_URI;
    try {
        const opts = {
          useNewUrlParser: true,
          useUnifiedTopology: true
        };
        const connectionInstance =
            await mongoose.connect(mongoConnectionString, opts);
        // eslint-disable-next-line no-console
        console.log(`Successfully Connected to Database. DB Host: ${connectionInstance.connection.host}`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Unable to establish connection to Database');
        process.exit(1);
      }
};
module.exports = { connect };

// Production   
// module.exports = {
//     HOST: "postgres",
//     USER: "postgres",
//     PASSWORD: "3766",
//     DB: "Account_manager",
//     dialect: "postgres",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// };