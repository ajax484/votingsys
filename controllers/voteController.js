const User = require('../models/user')
const Vote = require('../models/votes')
const Post = require('../models/posts')
const Candidate = require('../models/candidates')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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

const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({})
        res.status(200).send(candidates)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const vote = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const voted = decoded.voted
    const verified = decoded.verified
    try {
        if (!token) res.status(403).send({ message: 'Please login to vote' })
        if (voted && verified) {
            const vote = await Vote.create(req.body)
            res.status(200).send(vote)
        } else {
            res.status(400).send({ message: 'You have already voted' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { requestOtp, verifyOtp, getCandidates, vote }