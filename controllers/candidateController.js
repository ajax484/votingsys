const Candidate = require('../models/candidates');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;


const addCandidate = async (req, res) => {
    try {
        var token = req.header.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret)
        if (decoded.role === 'admin') {
            const candidate = await Candidate.create(req.body)
            res.status(200).json({ candidate })
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

const getCandidates = async (req, res) => {
    try{
    const candidates = await Candidate.find({})
    res.status(200).json({ candidates })
    }catch(error){
        res.status(400).send({ message: error.message })
    }
}

const getCandidate = async (req, res) => {
    try{
    const candidate = await Candidate.findById(req.params.id)
    res.status(200).json({ candidate })
    }catch(error){
        res.status(400).send({ message: error.message })
    }
}

const updateCandidate = async (req, res) => {
    if (decoded.role === 'admin') 
    try{
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({ candidate })
    } catch(error){
        res.status(400).send({ message: error.message })
    }
}

const deleteCandidate = async (req, res) => {
    if (decoded.role === 'admin') 
    try{
        const candidate = await Candidate.findByIdAndDelete(req.params.id)
        res.status(200).json({ candidate })
    } catch(error){
        res.status(400).send({ message: error.message })
    }
}
module.exports = { addCandidate, getCandidates, getCandidate, updateCandidate, deleteCandidate }
