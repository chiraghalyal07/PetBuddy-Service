const mongoose = require('mongoose')
const {Schema,model} = mongoose
const careTakerSchema = new Schema({
    careTakerName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    emailVerifird:{
        type:Boolean,
        default:false
    },
    phoneNumber:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    proof:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true
    }
})
const CareTaker = model('CareTaker',careTakerSchema)
module.exports = CareTaker