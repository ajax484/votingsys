const express = require('express')
const router = express.Router()
const {requestOtp, verifyOtp, getCandidates, vote} = require('../controllers/voteController')

router.post('/requestotp', requestOtp)
router.post('/verifyotp', verifyOtp)
router.get('/candidates', getCandidates)
router.post('/vote', vote)

module.exports = router