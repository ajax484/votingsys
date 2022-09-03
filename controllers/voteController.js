/* Importing the required modules. */
const User = require('../models/user')
const Vote = require('../models/votes')
const Post = require('../models/posts')
const Candidate = require('../models/candidates')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

/**
 * It sends an OTP to the user's email and verifies it.
 * @param req - request
 * @param res - The response object.
 * @returns the value of the function.
 */
const requestOtp = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const matric = decoded.matric
    const email = User.matric.replace('/', '-') + '@students.unilorin.edu.ng'
    try {
        const user = await user.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        const otp = Math.floor(Math.random() * 1000000)
        user.otp = otp
        await user.save()
        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        })
        const mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: 'NUESA Unilorin Voting System',
            text: 'Your OTP is ' + otp
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
        res.status(200).send({ message: 'OTP sent to your email' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It verifies the OTP sent to the user's email address.
 * </code>
 * @param req - request object
 * @param res - response object
 * @returns The user object
 */
const verifyOtp = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const matric = decoded.matric
    const otp = req.body
    try {
        const user = await User.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        if (user.otp === otp) {
            user.verified = true
            await User.save()
            res.status(200).send({ message: 'OTP verified' })
        } else {
            res.status(400).send({ message: 'Invalid OTP' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It's an async function that uses the mongoose model to find all the candidates in the database and
 * then sends them back to the client.
 * @param req - The request object.
 * @param res - The response object.
 */
const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({})
        res.status(200).send(candidates)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It creates a vote and updates the user's voted status to true.
 * </code>
 * @param req - request
 * @param res - response object
 */
const vote = async (req, res) => {
    let token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const voted = decoded.voted
    const verified = decoded.verified
    try {
        if (!token) res.status(403).send({ message: 'Please login to vote' })
        if (voted === false && verified === true) {
            const vote = await Vote.create(req.body)
            await User.findOneAndUpdate({ matric: decoded.matric }, { $set: { voted: true } })
            token = jwt.sign({ matric: decoded.matric, voted: true, verified: true }, process.env.JWT_SECRET, { expiresIn: '1h' })
            res.status(200).send({ message: 'Voted', token, vote })
        } else {
            res.status(400).send({ message: 'You have already voted' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/* Exporting the functions in the file. */
module.exports = { requestOtp, verifyOtp, getCandidates, vote }