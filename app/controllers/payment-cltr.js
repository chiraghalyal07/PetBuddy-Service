const Payment=require('../models/payment-model')
const Booking =require('../models/booking-model')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { validationResult } = require('express-validator')
const _= require('lodash')

const paymentCltr={}

paymentCltr.pay = async(req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty) {
        return res.status(400).json({ errors: errors.array() })
    }
    try{
        const userId = req.user.id;
        // Extract bookingId from request parameters
        const { bookingId } = req.params;
        console.log('userId:',userId);
        console.log('bookingId:',bookingId)

        // Find the booking record
        const booking = await Booking.findById(bookingId).populate('userId caretakerId petId petparentId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        console.log('booking Details:',booking)

        // Extract necessary data from booking
        const { caretakerId, petId, petparentId, totalAmount, bookingDurationInHours } = booking;

        
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

        // Create Payment
        const payment = new Payment({
            userId,
            caretakerId,
            bookingId,
            transactionId: session.id,
            paymentType: "card",
            amount: totalAmount,
            paymentStatus: "pending"
        });

        await payment.save();
         // Fetch the newly created payment with populated fields
         const populatedPayment = await Payment.findById(payment._id)
         .populate('userId caretakerId bookingId')
         .exec();

     res.json({
         id: session.id,
         url: session.url,
         payment: populatedPayment
     });
        

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'})
    }
}

paymentCltr.showall = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        // const userRole = req.user.role; // Extract role from token

        let payments;

        // if (userRole === 'petParent') {
            // Fetch all payments made by this PetParent
            payments = await Payment.find({ userId }).populate('userId caretakerId bookingId').exec();
        // } else if (userRole === 'careTaker') {
            // Fetch all payments received by this CareTaker
            // payments = await Payment.find({ caretakerId: userId }).populate('userId caretakerId bookingId').exec();
        // } else {
            // return res.status(403).json({ message: 'Access denied' });
        // }

        res.json({ payments });

    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = paymentCltr