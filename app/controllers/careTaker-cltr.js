const CareTaker = require('../models/careTaker-model')

const careTakerCltr = {}

careTakerCltr.create = async(req,res)=>{
    try{
        const caretaker = new CareTaker(req.body)
        await caretaker.save()
        res.status(201).json(caretaker)
    }catch(err){
        res.status(400).json({errors:errors.array()})
    }
}

careTakerCltr.showall = async(req,res)=>{
    try{
        const caretaker = await CareTaker.find()
        res.status(200).json(caretaker)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

careTakerCltr.showone = async(req,res)=>{
    try{
        const caretaker = await CareTaker.findById(req.params.id)
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
        const caretaker = await CareTaker.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidation:true})
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
        const caretaker = await CareTaker.findByIdAndDelete(req.params.id)
        if(!caretaker){
            return res.status(404).send()
        }
        res.status(200).json(caretaker)
    }catch(error){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

module.exports = careTakerCltr