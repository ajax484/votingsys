const User = require('../models/user')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const requestOtp = async (req, res) => {
    console.log(req.headers);
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const matric = decoded.matric
    console.log(matric);
    const email = matric.replace('/', '-') + '@students.unilorin.edu.ng'

    try {
        const user = await User.findOne({ matric })
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
    const { OTP } = req.body

    console.log(OTP);

    try {
        const user = await User.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' })
        }
        if (user.otp === OTP) {
            user.verified = true
            await user.save()
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

    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const matric = decoded.matric
        const verified = decoded.verified
        if (verified) {
            const candidate = await candidate.findOne({ nickname: candidate.nickname })
            candidate.votedBy.push(matric)
            candidate.votes += 1
            await candidate.save()
            res.status(200).send({ message: 'Voted successfully' })
        } else {
            res.status(400).send({ message: 'OTP not verified' })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}

module.exports = { requestOtp, verifyOtp, getCandidates, vote }