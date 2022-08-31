const Nominee = require('../models/nominees')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET


const nominate = async (req, res) => {
    try {
        const nominee = await Nominee.create(req.body)
        res.status(200).json({ nominee })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

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

