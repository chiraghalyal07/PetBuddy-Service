const Pet = require('../models/pet-model')
const PetParent = require('../models/petParent-model')
const {validationResult} = require('express-validator')

const petCltr ={}

petCltr.create = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.message)
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const body = req.body
        body.userId = req.user.id;

        const petParent = await PetParent.findOne({userId:req.user.id})
        console.log("PetParent :",petParent)
        if(!petParent) {
            return res.status(404).json({ errors: 'PetParent not found for this user' });
        }
        body.petParentId = petParent._id
        const pet = new Pet(body)
        await pet.save()
        const populatePet = await Pet.findById(pet._id).populate('userId','username email phoneNumber').populate('petParentId','parentPhoto address proof')
        res.status(201).json(populatePet);
    }catch(err){
        console.log(err.message)
        res.status(500).json({ errors: 'something went wrong'})    
    }

}
petCltr.showall = async (req,res)=>{
    try{
        const pets  = await Pet.find().populate('userId','username email phoneNumber').populate('petParentId','parentPhoto address proof');
        res.status(200).json(pets)
    }catch(err){
        res.status(500).json({errors:"Something went wrong"})
    }
}
petCltr.showone = async (req,res) =>{
    try{
        const pets = await Pet.findById(req.params.id).populate('userId','username email phoneNumber').populate('petParentId','parentPhoto address proof');
        if(!pets){
            return res.status(404).json({errors:"Pet not found"})
        }
        res.status(200).json(pets)
    }catch(err){
        res.status(500).json({errors:"Something went wrong"})
    }
}
petCltr.updateone = async (req,res) =>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = req.body;
        const pets = await Pet.findByIdAndUpdate(req.params.id,body,{new:true}).populate('userId','username email phoneNumber').populate('petParentId','parentPhoto address proof');
        if(!pets){
            return res.status(404).json({errors:"Pet not found"})
        }
        res.status(200).json(pets)
    }catch(err){
        res.status(500).json({errors:"Something went wrong"})
    }
}
petCltr.deleteone = async (req,res) =>{
    try{
        const pets = await Pet.findByIdAndUpdate(req.params.id);
        if(!pets){
            return res.status(404).json({errors:"Pet not found"})
        }
        res.status(200).json(pets,{message:"Pet deleted successfully"})
    }catch(err){
        res.status(500).json({errors:"Something went wrong"})
    }
}
module.exports = petCltr