// Confuguration of the Database
require("dotenv").config();
// Development
module.exports = {
    HOST: process.env.PGHOST,
    USER: process.env.PGUSER,
    PASSWORD: process.env.PGPASSWORD,
    DB: process.env.PGDATABASE,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

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