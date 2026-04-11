const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dotenv = require('dotenv')
dotenv.config()
require('./config/db')
const authRoute = require('./routes/authRoute')
const availabilityRoute = require('./routes/availabilityRoute')
const appointmentRoute = require('./routes/appointmentRoute')

// Middleware
app.use(express.json())

// Routes
app.get('/', (req, res) => res.json({ message: 'API is running' }))
app.use('/auth', authRoute)
app.use('/availability', availabilityRoute)
app.use('/appointments', appointmentRoute)

app.listen(port, () => console.log(`Server running on port ${port}`))