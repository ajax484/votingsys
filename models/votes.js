const mongoose = require('mongoose')

const VotesSchema = new mongoose.Schema({

    candidate: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidates', required: true }],
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true }],
    voter: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }],
}, { timestamps: true })

const Votes = new mongoose.model('Votes', VotesSchema)
module.exports = Votes