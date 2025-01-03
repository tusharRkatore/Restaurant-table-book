const Slot = require("../models/slotModel.js");

const generateSlotsForMonth = () => {
  const slots = [];
  const timeSlots = [
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
  ];

  const today = new Date();
  const daysToSeed = 30; // Seed slots for the next 30 days

  for (let i = 0; i < daysToSeed; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'

    timeSlots.forEach((time) => {
      slots.push({
        time,
        status: "Available",
        date: formattedDate,
      });
    });
  }
  return slots;
};

async function seedDatabase() {
  try {
    const slots = generateSlotsForMonth();

    // Using bulkWrite to handle duplicates
    const bulkOps = slots.map((slot) => ({
      updateOne: {
        filter: { time: slot.time, date: slot.date },
        update: { $setOnInsert: slot },
        upsert: true, // Insert if not exists
      },
    }));

    // Perform bulk write to avoid duplicate key errors
    await Slot.bulkWrite(bulkOps);
    console.log("Slots seeded for the next 30 days.");
  } catch (error) {
    console.error("Error seeding slots:", error);
  }
}

// Ensure seedDatabase is called
seedDatabase()
  .then(() => {
    console.log("Seeding complete.");
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
  });

module.exports = seedDatabase;
