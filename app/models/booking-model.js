const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// const serviceSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     amount: {
//         type: Number,
//         required: true
//     },
//     time: {
//         type: Number, // Duration in hours
//         required: true
//     }
// });

const bookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true // userId
    },
    caretakerId: {
        type: Schema.Types.ObjectId, // Correct field name is `caretakerId`
        ref: "CareTaker",
        required: true
    },
    petId: {
        type: Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    petparentId: {
        type: Schema.Types.ObjectId,
        ref: "PetParent",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    // services: [serviceSchema], // Array of services
    serviceName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    date: {
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        }
    },
    bookingDurationInHours: { 
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    Accepted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Booking = model('Booking', bookingSchema);
module.exports = Booking;
