const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        index: true
    },
    amount_paid: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

assignmentSchema.index({ event: 1, employee: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);