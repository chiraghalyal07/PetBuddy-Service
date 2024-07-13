const PetParent = require('../models/petParent-model')
const { validationResult } = require('express-validator');

const petParentCltr = {}

petParentCltr.create = async(req,res)=>{
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     console.log(errors.message)
    //     return res.status(400).json({ errors: errors.array() });
    // }
    try{
        const body = req.body
        body.userId = req.user.id
        const petParent = new PetParent(body)
        await petParent.save()
        const populatePetParent = await PetParent.findById(petParent._id).populate('userId','username email phoneNumber')
        res.status(201).json(populatePetParent)
        // res.status(201).json(petParent)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})    
    }
}

petParentCltr.showall = async(req,res)=>{
    try{
        const petParent = await PetParent.find().populate('userId','username email phoneNumber')
        res.status(200).json(petParent)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

petParentCltr.showone = async(req,res)=>{
    try{
        const petParent = await PetParent.findById(req.params.id).populate('userId','username email phoneNumber')
        if(!petParent){
            return res.status(404).send()
        }
        res.status(200).json(petParent)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

petParentCltr.updateone = async(req,res)=>{
    try{
        const petParent = await PetParent.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}).populate('userId','username email phoneNumber')
        if(!petParent){
            return res.status(404).send()
        }
        res.status(200).json(petParent)
    }catch(err){
        res.status(400).json({errors:errors.array()})
    }
}

petParentCltr.deleteone = async(req,res)=>{
    try{
        const petParent = await PetParent.findByIdAndDelete(req.params.id).populate('userId','username email phoneNumber')
        if(!petParent){
            return res.status(404).send()
        }
        res.status(200).json(petParent)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}
module.exports = petParentCltr