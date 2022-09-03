const mongoose = require('mongoose')

const PostsSchema = new mongoose.Schema({
    post: {
        type: String,
        required: true
    },
    maxVote: {
        type: Number,
        required: true
    },

}, { timestamps: true })

const Posts = new mongoose.model('Posts', PostsSchema)
module.exports = Posts