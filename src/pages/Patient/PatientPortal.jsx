import { useEffect, useState } from "react";
import { Calendar, Activity, FileText, CreditCard } from "lucide-react";
import { patientApi } from "../../api/patientApi";

const Card = ({ title, value, icon }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-4 hover:border-blue-500 transition">
        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            {icon}
        </div>
        <div>
            <p className="text-slate-300 text-sm">{title}</p>
            <h2 className="text-2xl font-bold text-white">{value}</h2>
        </div>
    </div>
);

const PatientPortal = () => {
    const [data, setData] = useState({
        name: "",
        nextAppointment: "-",
        vitals: "-",
        prescriptions: 0,
        bills: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await patientApi.getMe();
                const patient = res?.data?.data;

                console.log("Patient Data:", patient);

                // 🔥 Handle null profile
                if (!patient) {
                    setError("PROFILE_NOT_FOUND");
                    return;
                }

                setData({
                    name:
                        (patient.firstName || "") +
                        " " +
                        (patient.lastName || ""),
                    nextAppointment: "Coming Soon",
                    vitals: "Normal",
                    prescriptions: 0,
                    bills: 0,
                });
            } catch (err) {
                console.error("Dashboard error", err);

                if (
                    err.response?.status === 400 ||
                    err.response?.status === 404
                ) {
                    setError("PROFILE_NOT_FOUND");
                    return;
                }

                if (err.response?.status === 401) {
                    window.location.href = "/login";
                    return;
                }

                setError("FAILED");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // ✅ Loading UI
    if (loading) {
        return (
            <p className="text-gray-500 text-center mt-10">
                Loading dashboard...
            </p>
        );
    }

    // 🔥 No profile UI
    if (error === "PROFILE_NOT_FOUND") {
        return (
            <div className="text-center mt-16">
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                    No Profile Found
                </h2>
                <p className="text-gray-500 mb-6">
                    You haven't created your patient profile yet.
                </p>

                <button
                    onClick={() => (window.location.href = "/profile")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                    Create Profile
                </button>
            </div>
        );
    }

    // ❌ Generic error
    if (error === "FAILED") {
        return (
            <p className="text-red-500 text-center mt-10">
                Failed to load dashboard
            </p>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">
                    Patient Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                    Welcome, {data.name || "Patient"}
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Next Appointment"
                    value={data.nextAppointment}
                    icon={<Calendar />}
                />

                <Card
                    title="Vitals Status"
                    value={data.vitals}
                    icon={<Activity />}
                />

                <Card
                    title="Active Prescriptions"
                    value={data.prescriptions}
                    icon={<FileText />}
                />

                <Card
                    title="Pending Bills"
                    value={"₹" + data.bills}
                    icon={<CreditCard />}
                />
            </div>
        </div>
    );
};

export default PatientPortal;
