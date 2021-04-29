const mongoose = require('mongoose');

//create user model 
const UserSchema = mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    lastname : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone_number:{
        type:String,
        required:true,
    },
    role:{
        type:Number,
        required:true,
    },
    avatar:{
        type:String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('user',UserSchema);