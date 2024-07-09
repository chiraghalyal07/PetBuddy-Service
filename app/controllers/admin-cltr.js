const Admin = require('../models/admin-model')
const CareTaker = require('../models/careTaker-model')
const PetParent = require('../models/petParent-model')

const adminCltr = {}

adminCltr.getAllCareTakers = async(req,res)=>{
    try{
        const caretakers = await CareTaker.find()
        res.status(200).json(caretakers)
    }catch(error){
        res.status(500).json({ errors: 'something went wrong'})
    }
}
adminCltr.getAllPetParents = async(req,res)=>{
    try{
        const petParent = await PetParent.find()
        res.status(200).json(petParent)
    }catch(error){
        res.status(500).json({ errors: 'something went wrong'})
    }
}
adminCltr.verifyCareTaker = async(req,res)=>{
    try{
        const admin = await Admin.findOne()
        if(!admin){
            return res.status(500).json({ error: "Admin document not found" })
        }
        const caretaker = await CareTaker.findById(req.params.id)
        if(!caretaker){
            return res.status(404).json({ error: "Caretaker not found" })
        }
        if(!admin.verifiedCareTakers.includes(caretaker._id)){
            admin.verifiedCareTakers.push(caretaker._id)
            await admin.save()
        }
        res.status(200).json(caretaker)
    }catch(error){
        console.error("Error verifying caretaker:", error);
        res.status(500).json({ errors: 'something went wrong'})
    }
}
module.exports = adminCltr