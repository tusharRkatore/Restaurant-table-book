const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Booked"],
    default: "Available",
  },
  date: {
    type: String, // e.g., '2025-01-03'
    required: true,
  },
});

// Ensure unique slots per time and date to prevent duplicates
slotSchema.index({ time: 1, date: 1 }, { unique: true });

const Slot = mongoose.model("Slot", slotSchema);

module.exports = Slot;
