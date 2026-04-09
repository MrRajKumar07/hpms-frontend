import React, { useEffect, useState } from "react";
import { Bell } from 'lucide-react';
import axiosBase from "../api/axiosBase";
import { set } from "react-hook-form";
 // Let's use a real icon

const NotificationBell = () => {
  const [count, setCount] = useState(0);

const fetchCount = async () => {
  try {
    const res = await axiosBase.get("/notifications/unread-count");
    const value =
  typeof res.data === "number"
    ? res.data
    : res.data?.data ?? res.data?.count ?? 0;

if (typeof value !== "number") {
  console.error("Invalid notification count:", res.data);
  return;
}

setCount(value);
  } catch (err) {
    console.error("Error fetching notification count", err);
    setCount(0);
  }
};

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
      <Bell size={20} className="text-gray-600" />
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;