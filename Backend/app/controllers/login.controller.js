
const jwt = require("jsonwebtoken");

const db = require("../models");

const users = db.User;


exports.loginAndGenerateToken = async(req,res) => {
    try{

        const { username, password } = req.body;
        const user = await users.findOne(
          {
            where: {
              Email: username,
              password: password
            }
          }
        );
          
          if (user) {
              const token = jwt.sign({ sub: user.id, username: user.username }, "secretkey", {
              expiresIn: "1h",
          });
          
          user.token = token;
          await user.save();
          res.cookie("jwtToken", token, {
            expires: new Date(Date.now()+1000000),
            httpOnly: true
          });
          // console.log("calling and working");
          res.status(200).send({ token });
        } else {
          res
            .status(400)
            .json({ message: "Username or password is incorrect" });
        }
    }
    catch(error){
        console.log(error);
        return error;
    }
};


// Logout functionality
exports.logOutAndRemoveToken = async(req,res) => {
  // remove cookie 
  await res.clearCookie('jwtToken');
  res.status(200).send({ message: 'Logout successful' });
}