const Appointment = require("../models/AppointmentModel")
const Availability = require("../models/AvailabilityModel")

const handleBookAppointment = async (req, res) => {
    const { professorId, availabilitySlotId } = req.body;

    try {
        if (!professorId || !availabilitySlotId) {
            return res.status(400).json({ message: "Professor ID and Availability Slot ID are required" })
        }

        const studentId = req.user.id;

        const slot = await Availability.findById(availabilitySlotId);

        // Check if slot exists
        if (!slot) {
            return res.status(404).json({ message: "Slot not found" })
        }

        // Book the slot, use atomicity
        const bookSlot = await Availability.findOneAndUpdate(
            { _id: availabilitySlotId, isBooked: false },
            { isBooked: true },
            { new: true }
        )

        // If slot is already booked
        if (!bookSlot) {
            return res.status(400).json({ message: "Slot is already booked" })
        }

        // Create New Appointment
        const appointment = await Appointment.create({
            studentId,
            professorId,
            slotId: availabilitySlotId,
            status: "confirmed"
        })

        return res.status(201).json({ message: "Appointment booked successfully", appointment })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const handleGetMyAppointments = async (req, res) => {
    const { id, role } = req.user;

    try {
        let query;

        if (role === 'student') {
            query = { studentId: id };
        } else {
            query = { professorId: id };
        }

        const appointments = await Appointment.find(query)
            .populate('studentId', 'name email')
            .populate('professorId', 'name email')
            .populate('availabilitySlotId', 'startTime endTime');

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const handleCancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const professorId = req.user.id;

    try {
        const appointment = await Appointment.findById(appointmentId)

        // If appointment is not found
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" })
        }

        // Ensure professor cancels only his appointments
        if (appointment.professorId.toString() !== professorId) {
            return res.status(403).json({ message: "Unauthorized: You can only cancel your own appointments" })
        }

        // Cancel the appointment
        appointment.status = "cancelled";
        await appointment.save();

        // Make the slot free again
        await Availability.findByIdAndUpdate(appointment.availabilitySlotId, { isBooked: false });

        return res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    handleBookAppointment,
    handleGetMyAppointments,
    handleCancelAppointment
}