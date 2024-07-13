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
        body.userId = req.user.id
        const petParent = await PetParent.findOne({userId:req.user._id})
        if(!petParent) {
            return res.status(404).json({ errors: 'PetParent not found for this user' });
        }
        body.petParentId = req.petParent.id
        const pet = new Pet(body)
        await pet.save()
        const populatePet = await Pet.findById(pet._id).populate('userId','username email phoneNumber').populate('petParentId','parentPhoto address proof')
        res.status(201).json(populatePet)
        // res.status(201).json(pet)
    }catch(err){
        console.log(err.message)
        res.status(500).json({ errors: 'something went wrong'})    
    }

}

module.exports = petCltr