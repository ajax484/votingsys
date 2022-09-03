const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'admin'
    }
},
    { timestamps: true }
)

const Admin = new mongoose.model('Admin', AdminSchema)
module.exports = Admin