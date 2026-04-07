const express = require("express")
const router = express.Router()
const { handleAvailability, handleGetUnbookedSlots } = require("../controllers/availabilityController")

// ! Protected Route (Only Professor)
router.post("/", handleAvailability)

// Route to get unbooked slots
router.get("/:professorId", handleGetUnbookedSlots)

module.exports = router