
/* Importing the candidate model. */
const Candidate = require('../models/candidates');

/* Importing the jsonwebtoken module. */
const jwt = require('jsonwebtoken');

/* A secret key used to sign the JWT. */
const secret = process.env.JWT_SECRET;


/**
 * It creates a new candidate in the database.
 * @param req - request
 * @param res - the response object
 */
const addCandidate = async (req, res) => {
    try {
        var token = req.header.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret)
        if (decoded.role === 'admin') {
            const candidate = await Candidate.create(req.body)
            res.status(201).json({ candidate })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It's an async function that uses the mongoose model to find all the candidates in the database and
 * then sends them back to the client.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({})
        res.status(200).json({ candidates })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It's an async function that uses the await keyword to wait for the result of the findById() method. 
 * 
 * 
 * The findById() method is a mongoose method that takes the id of the candidate as a parameter. 
 * 
 * The id is passed in the request parameters. 
 * 
 * The result of the findById() method is assigned to the candidate variable. 
 * 
 * The candidate variable is then sent back to the client in the response. 
 * 
 * If an error occurs, the error message is sent back to the client in the response.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
        res.status(200).json({ candidate })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It updates a candidate's information in the database.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const updateCandidate = async (req, res) => {
    if (decoded.role === 'admin')
        try {
            const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.status(200).json({ candidate })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
}

/**
 * It deletes a candidate from the database if the user is an admin.
 * @param req - request
 * @param res - the response object
 */
const deleteCandidate = async (req, res) => {
    if (decoded.role === 'admin')
        try {

            const candidate = await Candidate.findByIdAndDelete(req.params.id)
            res.status(200).json({ candidate })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
}

/**
 * It gets the candidate votes by id.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
const getCandidateVotes = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
        res.status(200).json({ candidate })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It gets the candidate voters by id.
 * @param req - request
 * @param res - the response object
 */
const getCandidateVoters = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
        res.status(200).json({ candidate })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/* Exporting the functions to be used in other files. */
module.exports = { addCandidate, getCandidates, getCandidate, updateCandidate, deleteCandidate, getCandidateVotes, getCandidateVoters }