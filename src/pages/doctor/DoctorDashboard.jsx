import { useEffect, useState } from "react";
import { doctorApi } from "../../api/doctorApi";

export default function DoctorDashboard() {

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorApi.getDashboard()
      .then(res => {
        setData(res || {}); 
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setData({}); 
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-2 text-gray-900">Doctor Dashboard</h1>

      {loading && (
        <p className="mb-4 text-slate-400">Loading dashboard...</p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-slate-800 rounded-2xl p-6 flex items-center gap-4 border border-slate-700">
          <div className="p-3 bg-slate-700 rounded-xl">👨‍⚕️</div>
          <div>
            <p className="text-sm text-slate-400">Total Patients</p>
            <p className="text-xl font-semibold">
              {data?.totalPatientsCount ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 flex items-center gap-4 border border-slate-700">
          <div className="p-3 bg-slate-700 rounded-xl">📄</div>
          <div>
            <p className="text-sm text-slate-400">Pending Records</p>
            <p className="text-xl font-semibold">
              {data?.pendingRecordsCount ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 flex items-center gap-4 border border-slate-700">
          <div className="p-3 bg-slate-700 rounded-xl">⭐</div>
          <div>
            <p className="text-sm text-slate-400">Average Rating</p>
            <p className="text-xl font-semibold">
              {data?.averageRating ?? 0}
            </p>
          </div>
        </div>

      </div>

      {/* Appointments */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>

        {data?.upcomingAppointments?.length > 0 ? (
          data.upcomingAppointments.map((a, i) => (
            <div key={i} className="border-b border-slate-700 py-2">
              {JSON.stringify(a)}
            </div>
          ))
        ) : (
          <p className="text-slate-400">
            No upcoming appointments
          </p>
        )}
      </div>

    </div>
  );
}