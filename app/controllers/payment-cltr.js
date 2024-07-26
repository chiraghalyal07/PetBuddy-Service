const Payment=require('../models/payment-model')
const Booking =require('../models/booking-model')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { validationResult } = require('express-validator')
const _= require('lodash')

const paymentCntrl={}

paymentCntrl.pay = async(req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = _.pick(req.body,['totalAmount','bookingId'])
    console.log(body.totalAmount)
    //const body = req.body
   
    const bookedID = req.query.bookingId
    try{
       
        const booking = await Booking.findById(bookedID)
        console.log(bookedID)
        //create a customer
        const customer = await stripe.customers.create({
            name: "Testing",
            address: {
                line1: 'India',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        }) 
        
        //create a session object
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:'Pet Buddy'
                    },
                    unit_amount:booking.totalAmount * 100
                },
                quantity: 1
            }],
            mode:"payment",
            success_url:"http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/failure',
            customer : customer.id
        })
        
     
    //create Payment
    const payment= new Payment()
    payment.bookingId = bookingId
    payment.transactionId=session.id
    payment.amount= Number(body.totalAmount)
    payment.paymentType="card"
    await payment.save()
    res.json({id:session.id,url:session.url})
} catch(err){
    console.log(err)
    res.status(500).json({error:'Internal Server Error'})
}

}

module.exports=paymentCntrl