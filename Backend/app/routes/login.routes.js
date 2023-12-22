const loginController  = require("../controllers/login.controller");
const { loginAndGenerateToken, logOutAndRemoveToken, registerUser } = loginController;

var router = require("express").Router();

// register User
router.post("/register", registerUser);

// Sign in
router.post("/generateToken", loginAndGenerateToken);

// Signout
router.post("/logout",logOutAndRemoveToken);

module.exports = router;