import React, { useEffect, useState } from "react";
import { getAllUsers, activateUser, deactivateUser } from "../../api/adminApi";
import toast from "react-hot-toast";

// Path Fixes: Ensure these match where your files actually sit
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge"; // Based on your screenshot, Badge is in /components/
import DataTable from "../../components/data/DataTable";
import Modal from "../../components/overlays/Modal";
import LoadingSpinner from "../../components/feedback/LoadingSpinner";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State for Deactivation Confirmation
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null, userName: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      // Ensure we handle empty content safely
      setUsers(res.data.content || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      if (isActive) {
        // Find the user to display their name in the modal
        const userToDeactivate = users.find(u => u.id === id);
        setConfirmModal({ 
          isOpen: true, 
          userId: id, 
          userName: userToDeactivate?.name || "this user" 
        });
      } else {
        await activateUser(id);
        toast.success("User account activated");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Action failed. Please try again.");
    }
  };

  const confirmDeactivation = async () => {
    try {
      await deactivateUser(confirmModal.userId);
      toast.success(`${confirmModal.userName} deactivated`);
      setConfirmModal({ isOpen: false, userId: null, userName: "" });
      fetchUsers(); // Refresh list after change
    } catch (error) {
      toast.error("Deactivation failed");
    }
  };

  // Define table columns
  const columns = [
    // { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { 
      header: "Role", 
      render: (user) => (
        <span className="font-semibold text-xs uppercase text-gray-500">
          {user.role}
        </span>
      ) 
    },
    { 
      header: "Status", 
      render: (user) => (
        <Badge variant={user.active ? "success" : "danger"}>
          {user.active ? "Active" : "Inactive"}
        </Badge>
      )
    },
    { 
      header: "Action", 
      render: (user) => (
        <Button 
          variant={user.active ? "danger" : "success"} 
          size="sm" 
          onClick={() => handleToggleStatus(user.id, user.active)}
        >
          {user.active ? "Deactivate" : "Activate"}
        </Button>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm min-h-[80vh]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
          <p className="text-sm text-gray-500">Manage hospital roles and account permissions</p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchUsers}>Refresh List</Button>
      </div>

      <DataTable data={users} columns={columns} />

      {/* Confirmation Modal */}
      <Modal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title="Confirm Deactivation"
      >
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to deactivate <strong>{confirmModal.userName}</strong>? 
            They will lose access to the HPMS portal immediately.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDeactivation}
            >
              Confirm Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;