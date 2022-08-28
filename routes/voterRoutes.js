const express = require('express')
const router = express.Router()
const { getVoters,  deleteVoter} = require('../controllers/voterController')
router.get('/voters', getVoters)
router.delete('/voter/:id', deleteVoter)
module.exports = router