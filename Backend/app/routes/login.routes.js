const loginController  = require("../controllers/login.controller");
const { loginAndGenerateToken, logOutAndRemoveToken } = loginController;

var router = require("express").Router();

// Sign in
router.post("/generateToken", loginAndGenerateToken);

// Signout
router.post("/logout",logOutAndRemoveToken);

module.exports = router;