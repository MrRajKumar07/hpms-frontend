import React, { useEffect, useState } from "react";
import { getDashboard } from "../../api/adminApi";
import toast from "react-hot-toast";
import { Users, Stethoscope, Calendar, CreditCard, AlertTriangle } from "lucide-react";


// 🛠️ Missing Imports Fixed:
import LoadingSpinner from "../../components/feedback/LoadingSpinner";
import DataTable from "../../components/data/DataTable";
// Assuming StatCard is in your components/stats folder based on previous chat
import StatCard from "../../components/data/StatCard"; 
import Badge from "../../components/common/Badge";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboard();
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  // Define columns for the DataTable
  const appointmentColumns = [
    { header: "Patient", accessor: "patientName" },
    { header: "Time", accessor: "time" },
    { header: "Type", accessor: "type" },
    { 
      header: "Status", 
      render: (appt) => (
        <Badge variant={appt.status === "COMPLETED" ? "success" : "warning"}>
          {appt.status}
        </Badge>
      ) 
    },
  ];

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="p-6 text-center text-gray-500">No dashboard data available.</div>;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Hospital overview and real-time metrics</p>
      </div>

      {/* 🔥 KPI Cards - Using your Grid layout */}
     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
  <StatCard label="Total Patients" value={data.totalPatients} icon={Users} />
  <StatCard label="Doctors" value={data.totalDoctors} icon={Stethoscope} />
  <StatCard label="Today's Appts" value={data.todayAppointments} icon={Calendar} />
  <StatCard label="Pending Bills" value={data.pendingBills} icon={CreditCard} />
  <StatCard label="Critical Labs" value={data.unverifiedCriticalLabs} icon={AlertTriangle} color="red" />
</div>

      {/* 📋 Today's Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Today's Appointments</h3>
        
        {data.appointments?.length > 0 ? (
          <DataTable data={data.appointments} columns={appointmentColumns} />
        ) : (
          <div className="py-10 text-center border-2 border-dashed rounded-lg text-gray-400">
            No appointments scheduled for today.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;