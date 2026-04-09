import { useEffect, useState } from "react";
import { departmentApi } from "../../api/departmentApi";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    departmentApi.getAll().then(res => {
      setDepartments(res.data.data);
    });
  }, []);

  return (
    <div>
      <h2>Departments</h2>

      {departments.map(d => (
        <div key={d.id}>
          <h3>{d.name}</h3>
          <p>{d.description}</p>
        </div>
      ))}
    </div>
  );
}