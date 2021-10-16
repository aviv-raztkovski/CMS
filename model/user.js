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
    },
    password: { type: 'string' },
    token: { type: 'string'}
})

module.exports = mongoose.model('user', userSchema)