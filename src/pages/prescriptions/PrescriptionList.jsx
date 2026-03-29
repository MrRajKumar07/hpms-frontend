import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescriptionApi';
import {
  Pill, Download, Plus, Loader2, AlertCircle,
  CheckCircle2, XCircle, Clock, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TAB_ALL = 'all';
const TAB_ACTIVE = 'active';
const TAB_INACTIVE = 'inactive';

const StatusPill = ({ isActive, isFilled }) => {
  if (!isActive)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
        <XCircle size={11} /> Revoked
      </span>
    );
  if (isFilled)
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
        <CheckCircle2 size={11} /> Filled
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
      <Clock size={11} /> Active
    </span>
  );
};

export default function PrescriptionList() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [tab, setTab] = useState(TAB_ALL);
  const [allPrescriptions, setAllPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const isPatient = user?.role === 'PATIENT';
  const isDoctor = user?.role === 'DOCTOR';
  const isPharmacist = user?.role === 'PHARMACIST';

  useEffect(() => {
    if (isPatient) fetchByEmail(user.email);
  }, []);

  const fetchByEmail = async (email) => {
    setLoading(true);
    try {
      const res = await prescriptionApi.getByEmail(email);
      setAllPrescriptions(res.data.data ?? []);
    } catch {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchEmail(searchInput.trim());
    fetchByEmail(searchInput.trim());
  };

  const filtered = allPrescriptions.filter((p) => {
    if (tab === TAB_ACTIVE) return p.isActive && !p.isFilled;
    if (tab === TAB_INACTIVE) return !p.isActive || p.isFilled;
    return true;
  });

  const handleDownload = async (id, e) => {
    e.stopPropagation();
    setDownloadingId(id);
    try {
      const res = await prescriptionApi.downloadPdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to download');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFill = async (id) => {
    setActionId(id);
    try {
      const res = await prescriptionApi.markFilled(id, user.id);
      setAllPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? res.data.data : p))
      );
      toast.success('Prescription marked as filled');
    } catch {
      toast.error('Failed to mark as filled');
    } finally {
      setActionId(null);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke this prescription?')) return;
    setActionId(id);
    try {
      await prescriptionApi.revoke(id, user.id);
      setAllPrescriptions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: false } : p))
      );
      toast.success('Prescription revoked');
    } catch {
      toast.error('Failed to revoke');
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  const tabs = [
    { key: TAB_ALL, label: 'All', count: allPrescriptions.length },
    { key: TAB_ACTIVE, label: 'Active', count: allPrescriptions.filter((p) => p.isActive && !p.isFilled).length },
    { key: TAB_INACTIVE, label: 'Filled / Revoked', count: allPrescriptions.filter((p) => !p.isActive || p.isFilled).length },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Prescriptions</h1>
          <p className="text-sm text-slate-500 mt-0.5">{allPrescriptions.length} prescription{allPrescriptions.length !== 1 ? 's' : ''}</p>
        </div>
        {isDoctor && (
          <button
            onClick={() => navigate('/prescriptions/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> New Prescription
          </button>
        )}
      </div>

      {/* Search (doctor/pharmacist) */}
      {(isDoctor || isPharmacist) && (
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by patient email..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
            Search
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              tab === t.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span className="text-sm">Loading prescriptions...</span>
        </div>
      )}

      {/* Empty prompt */}
      {!loading && (isDoctor || isPharmacist) && !searchEmail && (
        <div className="text-center py-16 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter a patient email to view prescriptions</p>
        </div>
      )}

      {/* No results */}
      {!loading && (searchEmail || isPatient) && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <AlertCircle size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No prescriptions found in this category</p>
        </div>
      )}

      {/* Cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((rx) => (
            <div
              key={rx.id}
              className={`bg-white border rounded-2xl p-5 transition-all ${
                rx.isActive && !rx.isFilled
                  ? 'border-blue-200 shadow-sm shadow-blue-50'
                  : 'border-slate-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl ${rx.isActive && !rx.isFilled ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <Pill size={18} className={rx.isActive && !rx.isFilled ? 'text-blue-600' : 'text-slate-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-slate-800">{rx.medicationName}</p>
                      <StatusPill isActive={rx.isActive} isFilled={rx.isFilled} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-slate-500">
                      <span>{rx.dosage}</span>
                      <span>·</span>
                      <span>{rx.frequency}</span>
                      <span>·</span>
                      <span>{rx.duration}</span>
                    </div>
                    {rx.instructions && (
                      <p className="text-xs text-slate-400 mt-1.5 italic">{rx.instructions}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 mt-2 text-xs text-slate-400">
                      {rx.createdAt && <span>Prescribed: {formatDate(rx.createdAt)}</span>}
                      {rx.filledAt && <span>Filled: {formatDate(rx.filledAt)}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Pharmacist: Fill */}
                  {isPharmacist && rx.isActive && !rx.isFilled && (
                    <button
                      onClick={() => handleFill(rx.id)}
                      disabled={actionId === rx.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      {actionId === rx.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      Mark Filled
                    </button>
                  )}

                  {/* Doctor: Revoke */}
                  {isDoctor && rx.isActive && (
                    <button
                      onClick={() => handleRevoke(rx.id)}
                      disabled={actionId === rx.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {actionId === rx.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                      Revoke
                    </button>
                  )}

                  {/* PDF Download */}
                  <button
                    onClick={(e) => handleDownload(rx.id, e)}
                    disabled={downloadingId === rx.id}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
                    title="Download PDF"
                  >
                    {downloadingId === rx.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}