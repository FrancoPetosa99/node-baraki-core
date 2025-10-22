const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength: 20,
    },
    last_name: {
        type: String,
        maxlength: 20,
    },
    phone: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);