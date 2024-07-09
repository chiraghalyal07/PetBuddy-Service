const PetParent = require('../models/petParent-model')

const petParentCltr = {}

petParentCltr.create = async(req,res)=>{
    try{
        const petParent = new PetParent(req.body)
        await petParent.save()
        res.status(201).json(petParent)
    }catch(err){
        res.status(400).json({errors:errors.array()})
    }
}

petParentCltr.showall = async(req,res)=>{
    try{
        const petParent = await PetParent.find()
        res.status(200).json(petParent)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}

petParentCltr.showone = async(req,res)=>{
    try{
        const petParent = await PetParent.findById(req.params.id)
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
        const petParent = await PetParent.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
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
        const petParent = await PetParent.findByIdAndDelete(req.params.id)
        if(!petParent){
            return res.status(404).send()
        }
        res.status(200).json(petParent)
    }catch(err){
        res.status(500).json({ errors: 'something went wrong'})
    }
}
module.exports = petParentCltr