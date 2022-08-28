const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    surname: {
        type: String,
        required: true
    },

    firstname: {
        type: String,
        required: true
    },

    othernames: {
        type: String,
        required: false
    },

    matric: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['ABE', 'BME', 'CHE', 'CPE', 'CVE', 'ELE', 'FBE', 'MEE', 'MME', 'WRE']
    },
    role: {
        type: String,
        required: true,
        enum: ['voter', 'admin']
    },

    level: {
        type: String,
        // required: true,
        enum: ['100', '200', '300', '400', '500']
    },

    status: {
        type: String,
        required: true,
        enum: ['verified', 'unverified'],
        default: 'unverified'
    },
    confirmationCode: {
        type: String,
        unique: true,
        sparse: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        required: false
    }

})



const User = mongoose.model('User', UserSchema)
module.exports = User