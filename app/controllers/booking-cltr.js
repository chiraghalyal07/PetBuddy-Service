const Booking = require('../models/booking-model');
const CareTaker = require('../models/careTaker-model')
const Pet = require('../models/pet-model')
const PetParent = require('../models/petParent-model')
const { validationResult } = require('express-validator');

const bookingCltr = {};

bookingCltr.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const userId = req.user.id;
        const { caretakerId } = req.params;
        const { serviceName , date } = req.body;

        console.log('serviceName :',serviceName);
        console.log('received CareTakerId : ',caretakerId);

        // Fetch CareTaker details
        const caretaker = await CareTaker.findById(caretakerId);
        if (!caretaker) {
            return res.status(404).json({ errors: [{ msg: 'Caretaker not found' }] });
        }

        // Fetch Pet and PetParent details
        const pet = await Pet.findOne({ userId });
        if (!pet) {
            return res.status(404).json({ errors: [{ msg: 'Pet not found' }] });
        }
        const petParent = await PetParent.findById(pet.petParentId);
        if (!petParent) {
            return res.status(404).json({ errors: [{ msg: 'PetParent not found' }] });
        }

        // Find the service charge based on the serviceName
        const serviceCharge = caretaker.serviceCharges.find(charge => charge.name === serviceName);
        if (!serviceCharge) {
            return res.status(400).json({ errors: 'Invalid service name.' });
        }

        // Calculate the hourly rate
        const hourlyRate = serviceCharge.amount / serviceCharge.time;
        console.log('hourlyRate : ',hourlyRate)
        // Calculate the total booking time in hours
        const startTime = new Date(date.startTime);
        const endTime = new Date(date.endTime);
        const bookingDurationInHours = (endTime - startTime) / (1000 * 60 * 60);
        console.log('bookingDuration : ',bookingDurationInHours)
        // Calculate the total amount based on the booking duration
        const totalAmount = hourlyRate * bookingDurationInHours;
        const category = pet.category;

        const newBooking = new Booking({
            userId,
            caretakerId,
            petId: pet._id,
            petparentId: petParent._id,
            date,
            totalAmount: totalAmount,
            serviceName: serviceName,
            status:"pending",
            bookingDurationInHours: bookingDurationInHours,
            category
        });

        await newBooking.save();
        const populatedBooking = await Booking.findById(newBooking._id).populate('userId', 'username email phoneNumber').populate('caretakerId', 'careTakerBusinessName verifiedByAdmin address bio photo proof serviceCharges').populate('petId', 'petName age gender category breed petPhoto weigth').populate('petparentId', 'address photo proof');

        res.status(201).json(populatedBooking);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ errors: 'Something went wrong' });
    }
};

bookingCltr.showall = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId', 'username email phoneNumber').populate('caretakerId', 'careTakerBusinessName verifiedByAdmin address bio photo proof serviceCharges').populate('petId', 'petName age gender category breed petPhoto weigth').populate('petparentId', 'address photo proof');
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
