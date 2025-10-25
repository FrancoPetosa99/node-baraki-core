const mongoose = require('mongoose');

const EventStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED'
};
const statusValues = Object.values(EventStatus);

const hostSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

const guestSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 20,
    },
    last_name: {
        type: String,
        maxlength: 20,
    },
    email: {
        type: Number,
        required: true
    },
    assit: {
        type: Boolean,
        default: false
    }
});

const paymentSchema = new mongoose.Schema({
    total_price: {
        type: Number,
        required: true
    },
    advanced_payment: {
        type: Number,
        default: 0
    },
    method: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        default: 'PENDING',
        enum: ['PENDING', 'COMPLETED']
    }
});

const invitationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 20,
    },
    image_url: {
        type: String,
        maxlength: 20,
    }
});

const eventSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: statusValues,
        required: true,
        default: EventStatus.PENDING
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    host: {
        type: hostSchema,
        required: true
    },
    payment: {
        type: paymentSchema,
        required: true
    },
    assignments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Assignment',
        default: []
    },
    invitation: {
        type: invitationSchema,
        required: true
    },
    confirmed_guests: {
        type: guestSchema,
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);