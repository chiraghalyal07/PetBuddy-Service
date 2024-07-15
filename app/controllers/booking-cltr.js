const Booking = require('../models/booking-model');
const CareTaker = require('../models/careTaker-model')
const { validationResult } = require('express-validator');

const bookingCltr = {};

bookingCltr.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.message);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body;
        body.userId = req.user.id;
        const caretakerId = req.params.id; 
        // const parentId = req.user.id; 
        // console.log("parentid:",parentId)
        // console.log("careTaker:",caretakerId)

        const caretaker = await CareTaker.findById(caretakerId);
        // console.log("careTaker:",caretaker)
        if (!caretaker) {
            return res.status(404).json({ errors: 'Caretaker not found' });
        }
        const petParentId = body.petParentId;
        const petId = body.petId;

        const booking = new Booking(body);
        // booking.parentId = parentId;
        booking.caretakerId = caretaker;
        booking.petparentId = petParentId;
        // console.log("PETPARENT:",petParentId)
        booking.petId = petId;
        // console.log("PetId",petId)
        await booking.save();
        const populateBooking = await Booking.findById(booking._id)
            .populate('userId', 'username email phoneNumber')
            .populate('caretakerId', 'userId careTakerBusinessName bio address serviceCharges')
            .populate('petId', 'petName category')
            .populate('petparentId', ' address');
        res.status(201).json(populateBooking);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ errors: 'something went wrong' });
    }
};

bookingCltr.showall = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'username email phoneNumber')
            .populate('caretakerId', 'name contact')
            .populate('petId', 'petName category')
            .populate('parentId', 'parentName parentContact');
        res.status(200).json(bookings);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ errors: 'something went wrong' });
    }
};

bookingCltr.showone = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'username email phoneNumber')
            .populate('caretakerId', 'name contact')
            .populate('petId', 'petName category')
            .populate('parentId', 'parentName parentContact');
        if (!booking) {
            return res.status(404).json({ errors: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ errors: 'something went wrong' });
    }
};

bookingCltr.updateone = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.message);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body;
        const booking = await Booking.findByIdAndUpdate(req.params.id, body, { new: true })
            .populate('userId', 'username email phoneNumber')
            .populate('caretakerId', 'name contact')
            .populate('petId', 'petName category')
            .populate('parentId', 'parentName parentContact');
        if (!booking) {
            return res.status(404).json({ errors: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ errors: 'something went wrong' });
    }
};

bookingCltr.deleteone = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ errors: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ errors: 'something went wrong' });
    }
};
bookingCltr.acceptBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const caretakerId = req.user.id; // Assuming the caretaker's ID is available in req.user.id

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ errors: 'Booking not found' });
        }

        if (booking.caretakerId.toString() !== caretakerId) {
            return res.status(403).json({ errors: 'You are not authorized to accept this booking' });
        }

        booking.Accepted = true;
        await booking.save();

        const populateBooking = await Booking.findById(booking._id)
            .populate('userId', 'username email phoneNumber')
            .populate('caretakerId', 'name contact')
            .populate('petId', 'petName category')
            .populate('parentId', 'parentName parentContact');

        res.status(200).json(populateBooking);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ errors: 'something went wrong' });
    }
};


module.exports = bookingCltr;
