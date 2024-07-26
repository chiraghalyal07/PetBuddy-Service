const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User" // parentId
    },
    caretakerId: {
        type: Schema.Types.ObjectId, // careTakerId
        ref: "CareTaker"
    },
    petId: {
        type: Schema.Types.ObjectId,
        ref: "Pet"
    },
    petparentId: {
        type: Schema.Types.ObjectId,
        ref: "PetParent"
    },
    category: String,
    date: {
        startTime: Date,
        endTime: Date
    },
    status: {
        type: String,
        default: "pending"
    },
    totalAmount: Number,
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
