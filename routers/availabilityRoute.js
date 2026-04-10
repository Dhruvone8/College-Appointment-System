const express = require("express")
const router = express.Router()
const { handleAvailability, handleGetUnbookedSlots } = require("../controllers/availabilityController")
const { isLoggedIn, requireRole } = require("../middlewares/authMiddleware")

// ! Protected Route (Only Professor)
router.post("/", isLoggedIn, requireRole("professor"), handleAvailability)

// Route to get unbooked slots
router.get("/:professorId", isLoggedIn, requireRole("student"), handleGetUnbookedSlots)

module.exports = router