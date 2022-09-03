/*  */
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET


/**
 * It gets all the voters from the database and sends them back to the client.
 * @param req - request
 * @param res - response object
 */
const getVoters = async (req, res) => {
    try{
    const voters = await User.find({})
    res.status(200).json({ voters })
    }catch(error){
        res.status(400).send({ message: error.message })
    }
}

/**
 * It deletes a voter from the database if the user is an admin.
 * @param req - request
 * @param res - the response object
 */
const deleteVoter = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 'admin') 
    try{
        const voter = await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Voter deleted successfully', voter })
    } catch(error){
        res.status(400).send({ message: error.message })
    }
}
/* Exporting the functions to be used in other files. */
module.exports = {deleteVoter, getVoters }