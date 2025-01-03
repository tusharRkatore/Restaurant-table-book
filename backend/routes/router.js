const express = require("express");
const bookingSchema = require("../models/reservationModel");
const Slot = require("../models/slotModel"); // Assuming you have a slot model
const bookRouter = express.Router();

// Get Available Slots for a specific date
bookRouter.get("/api/available-slots/:date", async (req, res) => {
  const { date } = req.params; // The date chosen by the user
  try {
    // Fetch the slots for the given date and check if they are not booked
    const availableSlots = await Slot.find({
      date: date,
      status: "Available",
    });

    if (availableSlots.length === 0) {
      return res
        .status(404)
        .json({ message: "No available slots for this date." });
    }

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching available slots", error });
  }
});

// Create Booking
bookRouter.post("/api/bookings", async (req, res) => {
  const { name, contact, date, time, guests } = req.body;
  if (!name || !contact || !date || !time || !guests) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the slot is available before booking
    const slot = await Slot.findOne({ date, time, status: "Available" });
    if (!slot) {
      return res.status(400).json({ message: "Slot is not available" });
    }

    // Create the booking
    const newBooking = new bookingSchema({ name, contact, date, time, guests });
    await newBooking.save();

    // Mark the slot as booked
    slot.status = "Booked";
    await slot.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});

// Get All Bookings
bookRouter.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await bookingSchema.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

bookRouter.get("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking by ID (ensure the id is valid)
    const booking = await bookingSchema.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Return the booking details
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Booking by ID
bookRouter.delete("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await bookingSchema.findByIdAndDelete(id);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
});

module.exports = bookRouter;
