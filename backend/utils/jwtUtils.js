const jwt = require('jsonwebtoken');

exports.createToken = (userId,user)=>{
     return jwt.sign({
        userId,
        name:user.name,
        email:user.email,
     },process.env.JWT_SECRET,{expiresIn:"1d"})
};