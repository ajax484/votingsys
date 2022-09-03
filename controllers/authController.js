const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
require('dotenv').config()


/**
 * It creates a new user and sends a confirmation email to the user's email address.
 * </code>
 * @param req - request
 * @param res - the response object
 */
const register = async (req, res) => {
    try {
        const { surname, firstname, othernames, matric, password, level } = req.body
        var email = matric.replace('/', '-') + '@students.unilorin.edu.ng'
        const isExisting = await User.findOne({ matric })
        const token = jwt.sign({ surname: surname, firstname: firstname, matric, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        if (isExisting) {
            res.status(400).send({ message: 'User already exists' })
        } else {
            const user = new User({
                surname,
                firstname,
                othernames,
                matric,
                password,
                email,
                department: (matric.includes('ga') ? 'ABE' : matric.includes('gb') ? 'CVE'
                    : matric.includes('gc') ? 'ELE' : matric.includes('gd') ? 'MEE'
                        : matric.includes('gr') ? 'CPE' : matric.includes('gq') ? 'WRE'
                            : matric.includes('gt') ? 'FBE' : matric.includes('gm') ? 'MME'
                                : matric.includes('gn') ? 'CHE' : matric.includes('gp') ? 'BME' : 'Invalid'),
                level,
                confirmationCode: token,
            })

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
                to: '17-30gc091@students.unilorin.edu.ng',
                subject: 'Please confirm your account',
                html: `<h1>Please confirm your account</h1> <p>Please click the link to confirm your account: <a href="http://localhost:3000/confirm_token/${token}">Confirm</a></p> <p>If you did not request this, please ignore this email</p> <p>Thank you</p>`
            }
            await user.save()
            res.status(201).send({ message: 'User created successfully' })
            transport.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })

        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It finds a user with the confirmation code that matches the token in the url, then changes the
 * user's status to 'Verified' and saves the user.
 * @param req - request
 * @param res - the response object
 */
const verifyVoter = async (req, res) => {
    console.log('token: ', req.params.confirmationCode);
    User.findOne({ confirmationCode: req.params.confirmationCode })
        .then(user => {
            if (user) {
                user.status = 'verified'
                user.save()
                res.status(200).send({ message: 'User verified' })
            } else {
                res.status(400).send({ message: 'User not found' })
            }
        })
}

/**
 * It checks if the user is verified, if not, it returns a message, if yes, it returns a message.
 * </code>
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 * @returns The token is being returned.
 */
const login = async (req, res) => {
    const { matric, password } = req.body
    try {
        const user = await User.findOne({ matric })
        if (!user) {
            return res.status(400).send({ message: 'Invalid Matric Number' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid Password' })
        }
        const token = jwt.sign({ id: user._id, name: user.firstname, matric: user.matric, voted: user.voted, department: user.department, level: user.level, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const isVerified = decoded.verified

        if (!isVerified) {
            return res.status(400).send({ message: 'User not verified, Kindly check your email for verification link' })
        } else {
            return res.status(200).send({ token });
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It takes the matric number from the request body, finds the user with that matric number, signs a
 * token with the user's matric number, department, level, role and verified status, sends the token to
 * the user's email address and then sends a response to the client.
 * </code>
 * @param req - request object
 * @param res - the response object
 * @returns The token is being returned
 */
const forgotPassword = async (req, res) => {
    const { matric } = req.body
    const user = await User.findOne({ matric })
    if (!user) {
        return res.status(400).send({ message: 'Invalid Matric Number' })
    }
    const token = jwt.sign({ matric: user.matric, department: user.department, level: user.level, role: user.role, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '1h' })
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
        html: `<h1>Reset Password</h1> <p>Please click the link to reset your password: <a href="http://localhost:3000/reset_password/${token}">Reset</a></p>
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

/**
 * It takes a password from the request body, finds a user with the confirmation code from the request
 * params, if the user exists, it generates a salt, hashes the password, saves the user, and sends a
 * response.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The user object
 */
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

/**
 * It takes the token from the request header, signs it with a secret, and sets the expiration to 1
 * second.
 * @param req - The request object.
 * @param res - The response object.
 */
const logout = async (req, res) => {
    console.log(req.headers.authorization);
    try {
        let token = req.headers.authorization.split(' ')[1]
        console.log(token);
        token = jwt.sign({ token: token }, 'secret', { expiresIn: '5s' })
        res.status(200).send({ token, message: 'Logged out' })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

}

/* Exporting the functions in the file. */
module.exports = { register, login, verifyVoter, resetPassword, forgotPassword, logout }