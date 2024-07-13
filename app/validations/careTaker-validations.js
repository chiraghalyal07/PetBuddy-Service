const CareTaker = require('../models/careTaker-model')
const careTakerValidation = {
    userId:{
        custom:{
            options:async function(ele,{req}){
                const caretaker = await CareTaker.findOne({userId:req.user.id})
                if(caretaker){
                    throw new Error("User exist already")
                }else{
                    return true
                }
            }
        }
    },
    careTakerBusinessName:{
        exists:{
            errorMessage:"careTaker Name is Required"
        },
        notEmpty: {
            errorMessage: 'careTakerName cannot be blank'
        },
        trim:true
    },
    address:{
        exists: {
            errorMessage: 'address is required'            
        },
        notEmpty: {
            errorMessage: 'address cannot be empty'
        },
        trim:true
    },
    photo:{
        exists:{
            errorMessage: 'photo is required'
        },
        notEmpty:{
            errorMessage:'photo cannot be empty'
        },
        trim:true
    },
    proof:{
        exists:{
            errorMessage: 'proof is required'
        },
        notEmpty:{
            errorMessage:'proof cannot be empty'
        },
        trim:true
    },
    bio:{
        exists:{
            errorMessage: 'Bio is required'
        },
        notEmpty:{
            errorMessage:'Bio cannot be empty'
        },
        trim:true
    },
    // serviceCharges:{

    // } 

}

const careTakerUpdateValidation = {
    careTakerBusinessName :{
        exists: {
            errorMessage: 'careTakerName is required'
        },
        notEmpty: {
            errorMessage: 'careTakerName cannot be blank'
        },
        trim:true
    },
    phoneNumber:{
        exists:{
            errorMessage:'phoneNumber is required'
        },
        notEmpty:{
            errorMessage:'phoneNumber cannot be empty'
        },
        trim:true
    },
    address:{
        exists: {
            errorMessage: 'address is required'            
        },
        notEmpty: {
            errorMessage: 'address cannot be empty'
        },
        trim:true
    },
    photo:{
        exists:{
            errorMessage: 'photo is required'
        },
        notEmpty:{
            errorMessage:'photo cannot be empty'
        },
        trim:true
    },
    proof:{
        exists:{
            errorMessage: 'proof is required'
        },
        notEmpty:{
            errorMessage:'proof cannot be empty'
        },
        trim:true
    },
    bio:{
        exists:{
            errorMessage: 'Bio is required'
        },
        notEmpty:{
            errorMessage:'Bio cannot be empty'
        },
        trim:true
    },
    // serviceCharges:{

    // } 

}

module.exports = {
    careTakerValidation,
    careTakerUpdateValidation
}