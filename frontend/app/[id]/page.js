"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const checkCircle = require("../../public/check-circle.png");

export default function BookingConfirmation() {
  const params = useParams();
  const { id } = params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true); // To handle the loading state
  const router = useRouter();

  // Fetch the booking details using the booking ID
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (id) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/bookings/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch booking details");
          }
          const data = await response.json();
          setBooking(data);
        } catch (error) {
          console.error("Error fetching booking:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      }
    };

    fetchBookingDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!booking) {
    return <p>No booking found</p>; // If booking is not found or there was an error
  }

  const handleHomeRedirect = () => {
    router.push("/");
  };

  return (
    <div className="booking-card">
      <Image
        src={checkCircle}
        alt="Booking Confirmed"
        width={80}
        height={80}
        className="confirmation-icon"
      />

      <h1>Booking Confirmation</h1>
      <h2>Your Booking is Confirmed!</h2>
      <p>
        <strong>Name:</strong> {booking.name}
      </p>
      <p>
        <strong>Contact:</strong> {booking.contact}
      </p>
      <p>
        <strong>Date:</strong> {booking.date}
      </p>
      <p>
        <strong>Time:</strong> {booking.time}
      </p>
      <p>
        <strong>Guests:</strong> {booking.guests}
      </p>
      <p>
        <strong>Status:</strong> Confirmed
      </p>

      <button onClick={handleHomeRedirect} className="home-button">
        Back to Home
      </button>
    </div>
  );
}
