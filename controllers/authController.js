const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
require('dotenv').config()


const register = async (req, res) => {
    console.log(req.body)
    const { surname, firstname, othernames, matric, level, department, password } = req.body
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'voter';
    var email = matric.replace('/', '-') + '@students.unilorin.edu.ng'

    const user = new User({
        surname,
        firstname,
        othernames,
        matric,
        level,
        department,
        role,
        password,
        confirmationCode: 'tokens'
    })

    var token = jwt.sign({ firstname: user.firstname, matric: user.matric, department: user.department, level: user.level, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' })

    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        const transport = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 465,
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }

        })
        const mailOptions = {
            from: 'ibroraheem@zohomail.eu',
            to: email,
            subject: 'Please confirm your account',
            html: `<h1>Please confirm your account</h1>
       <p>Please click the link to confirm your account: <a href="http://localhost:3000/authentication/confirm/${token}">Confirm</a></p>
       <p>If you did not request this, please ignore this email</p>
       <p>Thank you</p>`
        }
        await user.save()
        res.status(201).send({ message: 'User created successfully' })
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('here');
                console.log(err)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

    } catch (error) {
        console.log(error.message);
        res.status(400).send({ message: error.message })
    }
}

const verifyVoter = async (req, res) => {
    User.findOne({ confirmationCode: req.params.token })
        .then(user => {
            if (user) {
                user.status = 'verified'
                user.save()
                console.log('here')
                res.status(200).send({ message: 'User verified' })
            } else {
                res.status(400).send({ message: 'User not found' })
            }
        })
}

const login = async (req, res) => {
    const { matric, password } = req.body
    console.log(matric, password);

    try {
        const user = await User.findOne({ matric })

        // if (user.status !== 'Verified') {
        //     return res.status(401).send({ message: 'Unverified Voter. Please check your email to verify your voter account' })
        // }

        if (!user) {
            return res.status(400).send({ message: 'Invalid Matric Number' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid Password' })
        }

        const token = jwt.sign({ firstname: user.firstname, matric: user.matric, department: user.department, level: user.level, role: user.role, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).send({ token })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    const { matric } = req.body
    const user = await User.findOne({ matric })
    if (!user) {
        return res.status(400).send({ message: 'Invalid Matric Number' })
    }
    const token = jwt.sign({ firstname: user.firstname, matric: user.matric, department: user.department, level: user.level, role: user.role, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const transport = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS
        }

    })
    const mailOptions = {
        from: 'NUESA',
        to: email,
        subject: 'Reset Password',
        html: `<h1>Reset Password</h1>
         <p>Please click the link to reset your password: <a href="http://localhost/reset/${token}">Reset</a></p>
            <p>If you did not request this, please ignore this email</p>
            <p>Thank you</p>`
    }
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

const resetPassword = async (req, res) => {
    const { password } = req.body
    const user = await User.findOne({ confirmationCode: req.params.token })
    if (!user) {
        return res.status(400).send({ message: 'Invalid Token' })
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.save()
    res.status(200).send({ message: 'Password reset successfully' })
}

module.exports = { register, login, verifyVoter, resetPassword, forgotPassword }