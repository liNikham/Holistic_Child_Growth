const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.createToken = (userId,user)=>{
     return jwt.sign({
        userId,
        name:user.name,
        email:user.email,
        role:user.role
     },process.env.JWT_SECRET)
};