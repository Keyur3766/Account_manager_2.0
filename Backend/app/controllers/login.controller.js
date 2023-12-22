
const jwt = require("jsonwebtoken");

const db = require("../models");
const User = require("../models/users.modal");

// const users = db.User;


exports.loginAndGenerateToken = async(req,res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne(
          {
            Email: email,
            passWord: password 
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


exports.registerUser = async(req,res) => {
  try{
      const user =  new User(req.body);
      await user.save().then(() => {
        res.status(200).json({message: "User registered successfully"});
      }).catch(() => {
        res.status(400).json({message: "Error in registering User"});
      });
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