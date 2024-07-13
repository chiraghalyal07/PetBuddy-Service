const CareTaker = require('../models/careTaker-model')
const { validationResult } = require('express-validator');

const careTakerCltr = {}

careTakerCltr.create = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const body = req.body
        body.userId = req.user.id
        const caretaker = new CareTaker(body)
        await caretaker.save()
        const populateCareTaker = await CareTaker.findById(caretaker._id).populate('userId','username email phoneNumber')
        res.status(201).json(populateCareTaker)
    }catch(err){
        console.log(err.message)
        res.status(500).json({ errors: 'something went wrong'})
    }
}

careTakerCltr.showall = async(req,res)=>{
    try{
        const caretaker = await CareTaker.find().populate('userId','username email phoneNumber')
        res.status(200).json(caretaker)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

careTakerCltr.showone = async(req,res)=>{
    try{
        const caretaker = await CareTaker.findById(req.params.id).populate('userId','username email phoneNumber')
        if(!caretaker){
            return res.status(404).send()
        }
        res.status(200).json(caretaker)
    }catch(error){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

careTakerCltr.update = async(req,res)=>{
    try{
        const caretaker = await CareTaker.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidation:true}).populate('userId','username email phoneNumber')
        if(!caretaker){
            return res.status(404).send()
        }
        res.status(200).json(caretaker)
    }catch(error){
        res.status(400).json({errors:errors.array()})
    }
}

careTakerCltr.delete = async(req,res)=>{
    try{
        const caretaker = await CareTaker.findByIdAndDelete(req.params.id).populate('userId','username email phoneNumber')
        if(!caretaker){
            return res.status(404).send()
        }
        res.status(200).json(caretaker)
    }catch(error){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

module.exports = careTakerCltr