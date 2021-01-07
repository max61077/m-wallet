const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNo: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0.00
    },
    transactions: {
        type: Array
    }
    
})

mongoose.model('User', userSchema);