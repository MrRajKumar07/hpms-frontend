import { useEffect, useState } from "react";
import { doctorApi } from "../../api/doctorApi";

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    doctorApi.getProfile()
      .then(data => setDoctor(data))
      .catch(err => console.error("Error fetching profile:", err));
  }, []);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div>
      <h2>{doctor.firstName} {doctor.lastName}</h2>
      <p>{doctor.specialization}</p>
      <p>Experience: {doctor.yearsExperience} years</p>
      <p>Rating: {doctor.rating}</p>
      <p>{doctor.bio}</p>
    </div>
  );
}