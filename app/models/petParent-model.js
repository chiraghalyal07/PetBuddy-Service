const mongoose = require('mongoose')
const {Schema,model} = mongoose
const petParentSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    parentPhoto:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    proof:{
        type:String,
        required:true
    }
})
const PetParent = model('PetPearent',petParentSchema)
module.exports = PetParent
