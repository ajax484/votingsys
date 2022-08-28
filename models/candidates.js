const mongoose = require('mongoose')
const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true
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
    department: {
        type: String,
        required: true
    },
    votedBy: {
        type: Array,
        default: []
    },
    votes: {
        type: Number,
        default: 0
    }
})

const Candidates = new mongoose.model('Candidates', CandidateSchema)

module.exports = Candidates