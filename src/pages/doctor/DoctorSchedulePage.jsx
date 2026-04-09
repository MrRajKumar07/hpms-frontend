import { useState } from "react";
import { doctorApi } from "../../api/doctorApi";

export default function DoctorSchedulePage({ doctorId }) {
  const [schedules, setSchedules] = useState([]);

  const handleSave = () => {
    doctorApi.setSchedule(doctorId, schedules)
      .then(() => alert("Saved"));
  };

  return (
    <div>
      <h2>Schedule</h2>

      <button onClick={handleSave}>Save</button>
    </div>
  );
}