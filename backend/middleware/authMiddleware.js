const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const verifyToken = async( req, res, next ) => {
     const token = req.header('Authorization');
     if(!token){
         return res.status(401).json({
             message:"Token not found"
         })
     }
     try{
         const decoded = jwt.verify(token,process.env.JWT_SECRET);
         req.user = decoded.userId;
         req.role = decoded.role;
         next();
     } catch(err){
         res.status(400).json({
             error : "Invalid token"
         })
     }
};

const restrictTo = ( role ) => ( req, res, next ) =>{
      if( req.role  !== role ) {
         return res.status(403).json({
            error: "Access Denied"
         })
      }
      next();
} 

module.exports = {
     verifyToken,
     restrictTo
}