const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
    name: { type:String, required:true },
    age: { type:Number, required:true },
    weight: { type:Number, required:true },
    height: { type:Number, required:true },
    gender: { type:String, required:true },
    guardian: [
        { 
            type:mongoose.Schema.Types.ObjectId, 
            ref:"User" 
        }],
    favoriteFoods: [
        { type:String }
    ],
    favoriteActivities: [
        { type:String }
    ],
    allergies: [
        { type:String }
    ],
    preferredSubjects: [
        { type:String }
    ],

},
{
    timestamps: true
}
)

const Child = mongoose.model("Child", childSchema);