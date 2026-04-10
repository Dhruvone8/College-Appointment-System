const express = require("express")
const router = express.Router()
const { handleBookAppointment, handleGetMyAppointments, handleCancelAppointment } = require("../controllers/appointmentController")

// Book an appointment
// ! Only Students can book appointments
router.post("/book", handleBookAppointment)

// Get all appointments
router.get("/my-appointments", handleGetMyAppointments)

// Cancel Appointment
// ! Only Professors can cancel appointment
router.patch("/:appointmentId/cancel", handleCancelAppointment)

module.exports = router