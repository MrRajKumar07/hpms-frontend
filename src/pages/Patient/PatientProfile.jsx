import { useEffect, useState } from "react";
import { patientApi } from "../../api/patientApi";
import { User, Phone, Droplet, MapPin, Calendar, Edit2, X, Check } from "lucide-react";

const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"];
const BLOOD_GROUP_OPTIONS = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];

const PatientProfile = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profileExists, setProfileExists] = useState(true);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await patientApi.getMe();
            setPatient(res.data.data);
            setFormData(res.data.data);
            setProfileExists(true);
        } catch (err) {
            console.error("Profile not found:", err);

            // 👉 No profile → switch to create mode
            setProfileExists(false);
            setIsEditing(true);
            setFormData({});
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (profileExists) {
                // UPDATE
                await patientApi.update(patient.id, formData);
                setPatient(formData);
            } else {
                // CREATE
                const res = await patientApi.create(formData);
                setPatient(res.data.data);
                setProfileExists(true);
            }

            setIsEditing(false);
        } catch (err) {
            alert("Failed to save profile. Check console.");
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">

            {/* Show message if no profile */}
            {!profileExists && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl">
                    No profile found. Please create your profile.
                </div>
            )}

            {/* Header Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                        {patient?.firstName?.[0] || "?"}{patient?.lastName?.[0] || ""}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {patient?.firstName || "New"} {patient?.lastName || "User"}
                        </h1>
                        <p className="text-gray-500 text-sm uppercase tracking-widest">
                            Patient Profile
                        </p>
                    </div>
                </div>

                {/* Edit / Create Buttons */}
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                    >
                        <Edit2 size={18} /> {profileExists ? "Edit Profile" : "Create Profile"}
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setFormData(patient || {});
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100"
                        >
                            <X size={18} /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md"
                        >
                            <Check size={18} /> Save
                        </button>
                    </div>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Personal Information */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                        Personal Information
                    </h3>
                    <div className="space-y-5">

                        <EditableItem
                            label="First Name"
                            icon={<User size={18} />}
                            isEditing={isEditing}
                            type="text"
                            value={formData.firstName}
                            onChange={(v) => setFormData({ ...formData, firstName: v })}
                        />

                        <EditableItem
                            label="Last Name"
                            icon={<User size={18} />}
                            isEditing={isEditing}
                            type="text"
                            value={formData.lastName}
                            onChange={(v) => setFormData({ ...formData, lastName: v })}
                        />

                        <EditableItem
                            label="Gender"
                            icon={<User size={18} />}
                            isEditing={isEditing}
                            type="select"
                            options={GENDER_OPTIONS}
                            value={formData.gender || ""}
                            onChange={(v) => setFormData({ ...formData, gender: v })}
                        />

                        <EditableItem
                            label="Date of Birth"
                            icon={<Calendar size={18} />}
                            isEditing={isEditing}
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(v) => setFormData({ ...formData, dateOfBirth: v })}
                        />

                        <EditableItem
                            label="Blood Group"
                            icon={<Droplet size={18} />}
                            isEditing={isEditing}
                            type="select"
                            options={BLOOD_GROUP_OPTIONS}
                            value={formData.bloodGroup}
                            onChange={(v) => setFormData({ ...formData, bloodGroup: v })}
                        />
                    </div>
                </div>

                {/* Contact Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
                        Contact Details
                    </h3>
                    <div className="space-y-5">
                        <EditableItem
                            label="Phone Number"
                            icon={<Phone size={18} />}
                            isEditing={isEditing}
                            type="text"
                            value={formData.phone}
                            onChange={(v) => setFormData({ ...formData, phone: v })}
                        />

                        <EditableItem
                            label="Full Address"
                            icon={<MapPin size={18} />}
                            isEditing={isEditing}
                            type="text"
                            value={formData.address}
                            onChange={(v) => setFormData({ ...formData, address: v })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Editable Field Component */
const EditableItem = ({ label, icon, value, isEditing, type, options, onChange }) => (
    <div className="flex items-start gap-4">
        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 mt-1">{icon}</div>
        <div className="flex-1">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">{label}</p>

            {isEditing ? (
                type === "select" ? (
                    <select
                        className="w-full p-2 bg-blue-50 border border-blue-100 rounded-lg"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        <option value="">Select</option>
                        {options.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt.replace("_", " ")}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        className="w-full p-2 bg-blue-50 border border-blue-100 rounded-lg"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )
            ) : (
                <p className="text-gray-700 font-bold text-lg">
                    {value ? value.toString().replace("_", " ") : "Not Set"}
                </p>
            )}
        </div>
    </div>
);

export default PatientProfile;

