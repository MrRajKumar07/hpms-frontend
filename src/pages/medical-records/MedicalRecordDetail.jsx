import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { medicalRecordApi } from '../../api/medicalRecordApi';
import VitalsCard from './VitalsCard';
import VitalsForm from './VitalsForm';
import {
  ArrowLeft, Download, Calendar, User, Stethoscope,
  ClipboardList, FlaskConical, Loader2, ChevronDown, ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Section = ({ title, icon: Icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className="text-blue-600" />
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow = ({ label, value }) =>
  value ? (
    <div className="flex gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="w-36 flex-shrink-0 text-sm text-slate-400 font-medium">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  ) : null;

export default function MedicalRecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showVitalsForm, setShowVitalsForm] = useState(false);

  const canEditVitals = user?.role === 'DOCTOR' || user?.role === 'NURSE';

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    setLoading(true);
    try {
      const res = await medicalRecordApi.getById(id);
      setRecord(res.data.data);
    } catch {
      toast.error('Failed to load medical record');
      navigate('/medical-records');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
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
      setDownloading(false);
    }
  };

  const handleVitalsUpdated = (updated) => {
    setRecord(updated);
    setShowVitalsForm(false);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Loading record...</span>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/medical-records')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Records
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download PDF
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">

        {/* Visit header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1">Visit Record</p>
              <h1 className="text-white text-xl font-bold">{record.diagnosis || 'Medical Record'}</h1>
              {record.icd10Code && (
                <span className="mt-2 inline-block px-2.5 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full">
                  ICD-10: {record.icd10Code}
                </span>
              )}
            </div>
            <div className="text-right text-sm text-blue-100">
              <div className="flex items-center gap-1.5 justify-end">
                <Calendar size={14} />
                {formatDate(record.visitDate)}
              </div>
              {record.followUpDate && (
                <p className="mt-1 text-amber-300 text-xs">
                  Follow-up: {formatDate(record.followUpDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* IDs section */}
        <div className="px-6 py-4 bg-slate-50">
          <Section title="Reference" icon={User}>
            <div className="grid grid-cols-2 gap-x-8">
              <InfoRow label="Patient ID" value={record.patientId} />
              <InfoRow label="Doctor ID" value={record.doctorId} />
              {record.appointmentId && <InfoRow label="Appointment ID" value={record.appointmentId} />}
            </div>
          </Section>
        </div>

        {/* Clinical notes */}
        <div className="px-6 py-5 space-y-5">
          <Section title="Clinical Notes" icon={ClipboardList}>
            <div className="bg-slate-50 rounded-xl px-4 py-1 divide-y divide-slate-100">
              <InfoRow label="Chief Complaint" value={record.chiefComplaint} />
              <InfoRow label="Symptoms" value={record.symptoms} />
              <InfoRow label="Diagnosis" value={record.diagnosis} />
              <InfoRow label="Treatment Plan" value={record.treatmentPlan} />
            </div>
          </Section>
        </div>

        {/* Vitals */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Vitals</h3>
            </div>
            {canEditVitals && (
              <button
                onClick={() => setShowVitalsForm((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showVitalsForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showVitalsForm ? 'Close' : 'Add / Update Vitals'}
              </button>
            )}
          </div>

          <VitalsCard record={record} />

          {/* Inline vitals form */}
          {showVitalsForm && canEditVitals && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-600 mb-4">Update Vitals</p>
              <VitalsForm recordId={id} onSuccess={handleVitalsUpdated} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}