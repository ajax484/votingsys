const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config()
connectDB()

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).send('Hello World')
})
app.use('', require('./routes/authRoutes'))
app.use('', require('./routes/voteRoutes'))
app.use('', require('./routes/candidateRoutes'))
app.use('', require('./routes/voterRoutes'))
app.use('', require('./routes/nomineeRoutes'))
app.use('/admin', require('./routes/adminRoutes'))
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})