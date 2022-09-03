const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET
/**
 * It creates a new admin user in the database.
 * @param req - The request object.
 * @param res - The response object.
 */

const register = async (req, res) => {
    try {
        const admin = await Admin.create(req.body)
        res.status(200).json({ admin })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

/**
 * It takes the email and password from the request body, checks if the email exists in the database,
 * if it does, it creates a token and sends it back to the user.
 * @param req - The request object.
 * @param res - The response object.
 */
const login = async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username })
        if (!admin) {
            res.status(400).send({ message: 'Invalid email or password' })
        } else {
            console.log(admin);
            const token = jwt.sign({ id: admin._id, role: 'admin' }, secret, { expiresIn: '1h' })
            res.status(200).json({ token })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

module.exports = { register, login }