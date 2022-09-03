/* Importing the Nominee model, the jsonwebtoken library, and the secret key from the environment
variables. */
const Nominee = require('../models/nominees')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET


/**
 * It creates a new nominee in the database using the data sent in the request body.
 * @param req - The request object.
 * @param res - the response object
 */
const nominate = async (req, res) => {
    try {
        const nominee = await Nominee.create(req.body)
        res.status(200).json({ nominee })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It gets all the nominees from the database and sends them to the client.
 * @param req - request
 * @param res - the response object
 */
const getNominees = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominees = await Nominee.find({})
            res.status(200).json({ nominees })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It gets a nominee by id, but only if the user is an admin.
 * @param req - request
 * @param res - the response object
 */
const getNominee = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominee = await Nominee.findById(req.params.id)
            res.status(200).json({ nominee })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/**
 * It takes a request, checks if the user is an admin, if they are, it updates the nominee with the id
 * in the request params with the body of the request.
 * @param req - the request object
 * @param res - the response object
 */
const updateNominee = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') {
        try {
            const nominee = await Nominee.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.status(200).json({ nominee })
        } catch (error) {
            res.status(400).send({ message: error.message })
        }
    } else {
        res.status(400).send({ message: 'You are not authorized to view this page' })
    }
}

/* Exporting the functions to be used in other files. */
module.exports = {nominate, getNominees, getNominee, updateNominee}

