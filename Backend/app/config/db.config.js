// Confuguration of the Database

// Development
module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "3766",
    DB: "Account_manager",
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