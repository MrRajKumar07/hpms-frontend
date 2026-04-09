import { useEffect, useState } from "react";
import { departmentApi } from "../../api/departmentApi";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    departmentApi.getAll().then(res => setDepartments(res.data.data));
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    if (selectedDept) {
      departmentApi.getDoctors(selectedDept).then(res =>
        setDoctors(res.data.data)
      );
    }
  };

  return (
    <div>
      <h2>Doctors</h2>

      <select onChange={(e) => setSelectedDept(e.target.value)}>
        <option value="">Select Department</option>
        {departments.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>

      <div>
        {doctors.map(doc => (
          <div key={doc.id}>
            <h3>{doc.firstName} {doc.lastName}</h3>
            <p>{doc.specialization}</p>
            <p>⭐ {doc.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}