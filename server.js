const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db')
require('dotenv').config()
connectDB()

app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).send('Hello World')
})
app.use('', require('./routes/authRoutes'))
app.use('', require('./routes/voteRoutes'))
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})