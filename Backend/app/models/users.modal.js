const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: false,
    },
    Email: {
        type: String,
        required: true,
        lowercase: true
    },
    Address: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    passWord: {
        type: String,
        required: true,
    },
    token: {
        type: String
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;

// module.exports  = (sequelize, Sequelize) => {
//     const User = sequelize.define("user", {
//         id: {
//             type: Sequelize.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         Name: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         Email: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         Address: {
//             type: Sequelize.STRING,
//             allowNull: false,
//         },
//         City: {
//             type:Sequelize.STRING,
//             allowNull: false
//         },
//         username: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         password: {
//             type: Sequelize.STRING,
//             allowNull: false
//         },
//         token: {
//             type: Sequelize.STRING
//         }
//     });

//     return User;

// }