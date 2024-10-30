const { connect } = require("../config/database");
require('dotenv').config();

const db = {};

connect();


module.exports = db;