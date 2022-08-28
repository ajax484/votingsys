const express = require('express')
const router = express.Router()
const {login, register, verifyVoter, forgotPassword, resetPassword} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.get('/confirm/:confirmationCode', verifyVoter)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

module.exports= router
