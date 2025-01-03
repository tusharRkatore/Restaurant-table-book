"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleBookingClick = () => {
    router.push("/booking");
  };

  return (
    <div className="landing-page">
      <section className="hero">
        <h1>Welcome to Our Restaurant</h1>
        <p>
          Experience fine dining and unforgettable flavors. Book your table now!
        </p>
        <button onClick={handleBookingClick} className="booking-btn">
          Book a Table
        </button>
      </section>
    </div>
  );
}
