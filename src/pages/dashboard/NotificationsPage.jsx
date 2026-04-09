import React, { useEffect, useState } from "react";
import { getNotifications, markRead } from "../../api/notificationApi";

import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import LoadingSpinner from "../../components/feedback/LoadingSpinner";
import { Bell, CheckCheck, Clock } from "lucide-react";

const NotificationsPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      setList(res.data.content || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    try {
      await markRead(id);
      setList(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          Notifications
        </h2>
        <Badge variant="ghost">{list.filter(n => !n.read).length} Unread</Badge>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          list.map(n => (
            <div 
              key={n.id} 
              className={`p-4 rounded-lg border transition-all flex items-start justify-between ${
                n.read ? "bg-white border-gray-100 opacity-75" : "bg-blue-50 border-blue-100 shadow-sm"
              }`}
            >
              <div className="flex gap-3">
                <div className={`mt-1 p-2 rounded-full ${n.read ? "bg-gray-100" : "bg-blue-100"}`}>
                  <Clock className={`w-4 h-4 ${n.read ? "text-gray-400" : "text-blue-600"}`} />
                </div>
                <div>
                  <p className={`font-medium ${n.read ? "text-gray-600" : "text-gray-900"}`}>
                    {n.message}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.read && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRead(n.id)}
                  className="flex gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark Read
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;