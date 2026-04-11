const Availability = require("../models/AvailabilityModel");
const User = require("../models/UserModel")
const mongoose = require("mongoose")

const handleAvailability = async (req, res) => {

    const { startTime, endTime } = req.body;
    const professorId = req.user.id;

    try {
        // Validate Input
        if (!startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Start time and end time are required"
            });
        }

        // Check startTime > endTime
        if (startTime >= endTime) {
            return res.status(400).json({
                success: false,
                message: "Start time must be before end time"
            });
        }

        // Add new slot to database
        const newSlot = await Availability.create({
            professorId,
            startTime,
            endTime,
            isBooked: false
        });

        return res.status(201).json({
            success: true,
            message: "Slot added successfully",
            data: newSlot
        });

    } catch (error) {
        console.error("Error adding availability slot:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const handleGetUnbookedSlots = async (req, res) => {
    const { professorId } = req.params

    try {
        // Check if professorId is valid
        if (!mongoose.Types.ObjectId.isValid(professorId)) {
            return res.status(400).json({ message: "Invalid professor ID" })
        }

        // Check if professor exists
        const professor = await User.findOne({ _id: professorId, role: "professor" })
        if (!professor) {
            return res.status(404).json({
                success: false,
                message: "Professor not found"
            })
        }

        // Fetch Unbooked slots for the professor id
        const slots = await Availability.find({
            professorId,
            isBooked: false
        })

        return res.status(200).json({
            success: true,
            message: "Available Slots Fetched Successfully",
            slots
        })

    } catch (error) {
        console.error("Error Fetching Slots", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    handleAvailability,
    handleGetUnbookedSlots
}