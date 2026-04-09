import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientApi } from "../../api/patientApi";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [debounced, setDebounced] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => setDebounced(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        if (debounced) handleSearch(debounced);
        else fetchPatients();
    }, [debounced]);

    const fetchPatients = async () => {
        const res = await patientApi.getAll();
        setPatients(res.data.data.content);
    };

    const handleSearch = async (q) => {
        const res = await patientApi.search(q);
        setPatients(res.data.data.content);
    };

    const getAge = (dob) => {
        if (!dob) return "-";
        const d = new Date(dob);
        return new Date().getFullYear() - d.getFullYear();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Patients</h1>

            <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded"
            />

            <table className="w-full">
                <thead>
                    <tr>
                        <th>NHS ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Blood</th>
                    </tr>
                </thead>

                <tbody>
                    {patients.map(p => (
                        <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)}>
                            <td>{p.nhsId}</td>
                            <td>{p.firstName} {p.lastName}</td>
                            <td>{getAge(p.dateOfBirth)}</td>
                            <td>{p.bloodGroup}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientList;