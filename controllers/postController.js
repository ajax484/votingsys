/* This is importing the required modules. */
const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const Posts = require('../models/posts')
const secret = process.env.JWT_SECRET

/**
 * It takes a request and a response, and if the request has a header with the key 'authorization' and
 * the value is a string that starts with 'Bearer' and has a space in it, then it splits the string at
 * the space, takes the second element of the array, decodes it using the secret, and if the decoded
 * object has a property called 'role' with the value 'admin', then it creates a new post using the
 * request body, saves it, and sends a response with a status of 200 and a message saying the post was
 * added successfully.
 * @param req - request
 * @param res - The response object.
 */
const addPost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = new Posts(req.body)
            post.save()
            res.status(200).json({ message: 'Post added successfully', post })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * If the user is an admin, then return all posts.
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - the response object
 */
const getPosts = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const posts = Posts.find({})
            res.status(200).json({ posts })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It gets a post by id, but only if the user is an admin.
 * @param req - request
 * @param res - the response object
 */
const getPost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = Posts.findById(req.params.id)
            res.status(200).json({ post })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It takes a request, checks the token, checks the role, and then updates the post.
 * @param req - The request object. This object represents the HTTP request and has properties for the
 * request query string, parameters, body, HTTP headers, and so on.
 * @param res - the response object
 */
const updatePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = Posts.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.status(200).json({ post })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It deletes a post if the user is an admin.
 * @param req - request
 * @param res - The response object.
 */
const deletePost = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try{
            const post = Posts.findByIdAndDelete(req.params.id)
            res.status(200).json({ post, message: 'Post deleted successfully' })
        }   catch(error){
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/* Exporting the functions. */
module.exports = { addPost, getPosts, getPost, updatePost, deletePost }