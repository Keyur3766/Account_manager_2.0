const jwt = require("jsonwebtoken");
const db = require("../models");

const users = db.User;
// const users = [
//     {
//         id: 1,
//         username: 'admin',
//         password: 'password123'
//     }
// ];


const Authenticate = async (req, res, next) => {
    try{
        const token = req.headers['x-access-token'];

        if (!token) {
            throw new Error('No JWT token found');
        }
        const verifyToken =  jwt.verify(token, "secretkey");

        const rootUser = await users.findOne(
            {
                where: 
                {
                    id: verifyToken.sub, 
                    token: token 
                }
            }
        );
        
        if(!rootUser){
            throw new Error('User not found');
        }

        req.token = token;
        req.rootUser = rootUser;
        req.UserId = rootUser.id;

        next();
    }
    catch(error){
        console.log(error);
        res.status(401).send("Unauthorized user");
    }
}    

module.exports = Authenticate;