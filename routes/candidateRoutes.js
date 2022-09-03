const express = require('express')
const router = express.Router()
const {getCandidate, addCandidate, getCandidates, getCandidateVotes, getCandidateVoters, updateCandidate, deleteCandidate} = require('../controllers/candidateController')
router.delete('/candidate/:id', deleteCandidate)
router.patch('/candidate/:id', updateCandidate)
router.get('/candidates', getCandidates)
router.get('/candidate/id', getCandidate)
router.get('/candidate-votes', getCandidateVotes)
router.post('/candidate', addCandidate)
router.get('/candidate-voters', getCandidateVoters)

module.exports = router