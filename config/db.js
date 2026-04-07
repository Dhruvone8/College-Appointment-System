const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

mongoose
    .connect(`${process.env.MONGODB_URI}/college-appointment-system`)
    .then(() => console.log("MongoDB Connection Established!! ✅"))
    .catch((err) => console.error("MongoDB Error:", err));

module.exports = mongoose.connection;