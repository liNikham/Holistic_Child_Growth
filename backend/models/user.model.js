const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

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
    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ChildProfile"
        }
    ],
    picture: {
        type: String,
        default: "https://www.gravatar.com/avatar/?d=mp"
    },

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

 module.exports = mongoose.model('User',userSchema);

