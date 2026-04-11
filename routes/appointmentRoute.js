const express = require("express")
const router = express.Router()
const { handleBookAppointment, handleGetMyAppointments, handleCancelAppointment } = require("../controllers/appointmentController")
const { isLoggedIn, requireRole } = require("../middlewares/authMiddleware")

// Book an appointment
// ! Only Students can book appointments
router.post("/book", isLoggedIn, requireRole("student"), handleBookAppointment)

// Get all appointments
router.get("/my-appointments", isLoggedIn, handleGetMyAppointments)

// Cancel Appointment
// ! Only Professors can cancel appointment
router.patch("/:appointmentId/cancel", isLoggedIn, requireRole("professor"), handleCancelAppointment)

module.exports = router