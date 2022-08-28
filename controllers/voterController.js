const User = require('../models/user')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET


const getVoters = async (req, res) => {
    try{
    const voters = await User.find({})
    res.status(200).json({ voters })
    }catch(error){
        res.status(400).send({ message: error.message })
    }
}

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
module.exports = {deleteVoter, getVoters }