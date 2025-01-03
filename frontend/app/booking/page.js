"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Booking() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Fetch available slots for the selected date using async/await
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (date) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/available-slots/${date}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch available slots");
          }
          const data = await response.json();
          console.log("Available slots:", data);
          setAvailableSlots(data);
        } catch (error) {
          console.error("Error fetching available slots:", error);
        }
      }
    };

    fetchAvailableSlots();
  }, [date]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setTime(slot.time); // Automatically set the time when a slot is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !contact || !date || !time || !guests || !selectedSlot) {
      alert("All fields are required, and a slot must be selected");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          contact,
          date,
          time,
          guests,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Booking confirmed:", data);
        setSuccessMessage(
          `Booking confirmed for ${data.name} on ${data.date} at ${data.time}`
        );
        setTimeout(() => {
          router.push(`/${data._id}`);

          // Redirect to homepage after successful booking
        }, 2000);
      } else {
        alert(
          "Selected slot is no longer available. Please select another slot."
        );
      }
    } catch (error) {
      alert("Error making booking: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Restaurant Table Booking</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Details"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        {availableSlots.length > 0 && (
          <div>
            <h2>Select Available Slot</h2>
            <ul>
              {availableSlots.map((slot) => (
                <li
                  key={slot._id} // Ensure this is unique
                  onClick={() => handleSlotSelect(slot)}
                  className={selectedSlot === slot ? "selected" : ""}
                >
                  {slot.time} -{" "}
                  {slot.status === "Available" ? "Available" : "Booked"}
                </li>
              ))}
            </ul>
          </div>
        )}
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
          required
        />
        <button type="submit" disabled={!selectedSlot}>
          Book Now
        </button>
      </form>

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}
