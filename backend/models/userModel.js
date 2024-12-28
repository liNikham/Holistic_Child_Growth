const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const childSchema = new mongoose.Schema({
     name : { 
        type :String,
         email : { 
            type:String, 
            required:true,
            unique:true
         },
         password:{
             type:String, 
             required:true
         }

     }
})

childSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String, 
        enum:["parent","child"],
        default:"parent"

    },
    children:[childSchema]
    }
);

// hash the password before saving 
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

// method to compare passwods
 userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
 }

 const User = mongoose.model('User',userSchema);
 module.exports = User;
