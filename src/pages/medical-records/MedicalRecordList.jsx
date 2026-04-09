import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { medicalRecordApi } from '../../api/medicalRecordApi';
import {
  FileText, Download, ChevronRight, Plus, Calendar,
  Search, ChevronLeft, Loader2, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const StatusBadge = ({ code }) =>
  code ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
      ICD-10: {code}
    </span>
  ) : null;

export default function MedicalRecordList() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const isDoctor = user?.role === 'DOCTOR';
  const isNurse = user?.role === 'NURSE';
  const isPatient = user?.role === 'PATIENT';

  useEffect(() => {
    if (isPatient) {
      fetchByEmail(user.email, 0);
    }
  }, []);

  useEffect(() => {
    if (searchEmail) fetchByEmail(searchEmail, page);
  }, [page]);

  const fetchByEmail = async (email, pageNum) => {
    setLoading(true);
    try {
      const res = await medicalRecordApi.getByEmail(email, pageNum, 10);
      const pageData = res.data.data;
      setRecords(pageData.content ?? []);
      setTotalPages(pageData.totalPages ?? 0);
      setTotalElements(pageData.totalElements ?? 0);
    } catch {
      toast.error('Failed to load medical records');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setPage(0);
    setSearchEmail(searchInput.trim());
    fetchByEmail(searchInput.trim(), 0);
  };

  const handleDownload = async (id, e) => {
    e.stopPropagation();
    setDownloadingId(id);
    try {
      const res = await medicalRecordApi.exportPdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `medical-record-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Failed to download PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Records</h1>
          {totalElements > 0 && (
            <p className="text-sm text-slate-500 mt-0.5">{totalElements} record{totalElements !== 1 ? 's' : ''} found</p>
          )}
        </div>
        {(isDoctor || isNurse) && (
          <button
            onClick={() => navigate('/medical-records/create')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Record
          </button>
        )}
      </div>

      {/* Search (Doctor/Nurse) */}
      {(isDoctor || isNurse) && (
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
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      )}

      {/* State: loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 size={24} className="animate-spin mr-2" />
          <span className="text-sm">Loading records...</span>
        </div>
      )}

      {/* State: empty prompt for doctor */}
      {!loading && (isDoctor || isNurse) && !searchEmail && (
        <div className="text-center py-16 text-slate-400">
          <Search size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Enter a patient email to search records</p>
        </div>
      )}

      {/* State: no results */}
      {!loading && searchEmail && records.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <AlertCircle size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No medical records found</p>
        </div>
      )}

      {/* State: patient no records */}
      {!loading && isPatient && records.length === 0 && !loading && (
        <div className="text-center py-16 text-slate-400">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No medical records yet</p>
        </div>
      )}

      {/* Timeline */}
      {!loading && records.length > 0 && (
        <div className="relative">
          {/* Timeline bar */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="relative flex gap-4">
                {/* Dot */}
                <div className="relative z-10 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <FileText size={16} className="text-white" />
                </div>

                {/* Card */}
                <div
                  onClick={() => navigate(`/medical-records/${record.id}`)}
                  className="flex-1 bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar size={12} />
                          {formatDate(record.visitDate)}
                        </span>
                        <StatusBadge code={record.icd10Code} />
                      </div>

                      {record.diagnosis && (
                        <p className="font-semibold text-slate-800 truncate">{record.diagnosis}</p>
                      )}
                      {record.chiefComplaint && (
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{record.chiefComplaint}</p>
                      )}
                      {record.followUpDate && (
                        <p className="text-xs text-amber-600 mt-2 font-medium">
                          Follow-up: {formatDate(record.followUpDate)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => handleDownload(record.id, e)}
                        disabled={downloadingId === record.id}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
                        title="Download PDF"
                      >
                        {downloadingId === record.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-sm text-slate-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}