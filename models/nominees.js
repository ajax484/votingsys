const mongoose = require('mongoose')

const NomineeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    otherNames: {
        type: String,
    },
    matricNumber: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true,
        enum: ['President', 'Vice President', 'General Secretary', 'Financial Secretary', 'Sports Secretary', 'Welfare Secretary', 'PRO', 'Assistant General Secretary', 'Social Secretary', 'Technical Director', 'SRC']
    },
    image: {
        data: Buffer,
        contentType: String
    },
    cgpa: {
        type: Number,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['100', '200', '300', '400',]
    },
},
    { timestamps: true }
)

const Nominees = new mongoose.model('Nominees', NomineeSchema)
module.exports = Nominees