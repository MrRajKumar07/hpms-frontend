export const Badge = ({ status }) => {
  const map = {
    success: "bg-green-500",
    pending: "bg-yellow-500",
    failed: "bg-red-500",
    completed: "bg-blue-500",
  };
  return <span className={`px-2 py-1 text-white rounded ${map[status] || "bg-gray-400"}`}>{status}</span>;
};