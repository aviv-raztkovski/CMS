const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { 
        type: 'string',
        default: null
    },
    lastName: { 
        type: 'string',
        default: null
    },
    email: { 
        type: 'string',
        unique: true,
        required: true
    },
    password: { 
        type: 'string', 
        required: true
    },
    token: { type: 'string'}
})

module.exports = mongoose.model('user', userSchema)