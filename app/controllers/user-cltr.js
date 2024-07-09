const User = require('../models/user-model')
const {validationResult} = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const twilio = require('twilio')
const _ = require('lodash')

const userCltr = {}

userCltr.register = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = req.body
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password,salt)
        const user = new User(body)
        user.password = hashPassword
        await user.save()
        res.status(201).json(user)

    }catch(err){
        console.log(err.message)
        res.status(500).json({errors:"something went wrong"})
    }
}
userCltr.login = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(200).json({errors:errors.array()})
    }
    try{
        const body = _.pick(req.body,['email','password'])
        const user = await User.findOne({email:body.email})
        if(user){
            const isAuth = await bcryptjs.compare(body.password,user.password)
            if(isAuth){
                const tokenData = {
                    id:user._id,
                    role:user.role
                }
                const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'7d'})
                return res.json({token})
            }
            return res.status(404).json({errors:'invalid email or password'})
        }
        return res.status(404).json({errors:'invalid email or password'})

    }catch(err){
        console.log(err.message)
        return res.status(500).json('something went wrong')
    }
}
userCltr.account = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        return res.json(user)
    }catch(err){
        return res.status(500).json({errors:'something went wrong'})
    }
}
module.exports = userCltr