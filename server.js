const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dotenv = require('dotenv')
dotenv.config()
require('./config/db')
const authRoute = require('./routers/authRoute')
const availabilityRoute = require('./routers/availabilityRoute')
const appointmentRoute = require('./routers/appointmentRoute')

// Middlewares

// Routes
app.use('/auth', authRoute)
app.use('/availability', availabilityRoute)
app.use('/appointments', appointmentRoute)

app.listen(port, () => console.log(`Server running on port ${port}`))