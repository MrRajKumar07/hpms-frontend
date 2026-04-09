import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { prescriptionApi } from '../../api/prescriptionApi';
import { ArrowLeft, Loader2, Pill } from 'lucide-react';
import toast from 'react-hot-toast';

const FREQUENCY_OPTIONS = [
  { value: 'Once daily', label: 'Once daily' },
  { value: 'Twice daily', label: 'Twice daily (BD)' },
  { value: 'Thrice daily', label: 'Thrice daily (TDS)' },
  { value: 'Four times daily', label: 'Four times daily (QID)' },
  { value: 'Every 6 hours', label: 'Every 6 hours' },
  { value: 'Every 8 hours', label: 'Every 8 hours' },
  { value: 'Every 12 hours', label: 'Every 12 hours' },
  { value: 'Once weekly', label: 'Once weekly' },
  { value: 'As needed', label: 'As needed (SOS/PRN)' },
];

const Field = ({ label, required, hint, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {hint && <span className="ml-1.5 text-xs text-slate-400 font-normal">{hint}</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border ${
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
  } focus:outline-none focus:ring-2 bg-white transition-colors`;

export default function CreatePrescription() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );
    try {
      await prescriptionApi.create(payload);
      toast.success('Prescription created successfully');
      navigate('/prescriptions');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create prescription');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/prescriptions')}
          className="text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100">
            <Pill size={18} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">New Prescription</h1>
            <p className="text-xs text-slate-400">Create a prescription for a patient</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Patient & Doctor */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Patient & Doctor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Patient ID" required error={errors.patientId}>
              <input
                className={inputClass(errors.patientId)}
                placeholder="Patient UUID"
                {...register('patientId', { required: 'Patient ID is required' })}
              />
            </Field>
            <Field label="Doctor ID" required error={errors.doctorId}>
              <input
                className={inputClass(errors.doctorId)}
                placeholder="Doctor UUID"
                {...register('doctorId', { required: 'Doctor ID is required' })}
              />
            </Field>
            <Field label="Appointment ID" hint="(optional)" error={errors.appointmentId}>
              <input
                className={inputClass(errors.appointmentId)}
                placeholder="Appointment UUID"
                {...register('appointmentId')}
              />
            </Field>
          </div>
        </div>

        {/* Medication */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Medication Details</h2>

          <Field label="Medication Name" required error={errors.medicationName}>
            <input
              className={inputClass(errors.medicationName)}
              placeholder="e.g. Amoxicillin, Paracetamol 500mg"
              {...register('medicationName', {
                required: 'Medication name is required',
                maxLength: { value: 255, message: 'Max 255 characters' },
              })}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Dosage" required error={errors.dosage}>
              <input
                className={inputClass(errors.dosage)}
                placeholder="e.g. 500mg, 1 tablet"
                {...register('dosage', {
                  required: 'Dosage is required',
                  maxLength: { value: 100, message: 'Max 100 characters' },
                })}
              />
            </Field>

            <Field label="Frequency" required error={errors.frequency}>
              <select
                className={inputClass(errors.frequency)}
                {...register('frequency', { required: 'Frequency is required' })}
              >
                <option value="">Select frequency...</option>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Duration" required error={errors.duration}>
              <input
                className={inputClass(errors.duration)}
                placeholder="e.g. 5 days, 2 weeks, 1 month"
                {...register('duration', {
                  required: 'Duration is required',
                  maxLength: { value: 100, message: 'Max 100 characters' },
                })}
              />
            </Field>
          </div>

          <Field label="Additional Instructions" hint="(optional)" error={errors.instructions}>
            <textarea
              rows={3}
              className={inputClass(errors.instructions) + ' resize-none'}
              placeholder="e.g. Take after meals, avoid alcohol, do not crush tablet..."
              {...register('instructions', {
                maxLength: { value: 2000, message: 'Max 2000 characters' },
              })}
            />
          </Field>
        </div>

        {/* Preview strip */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Summary</p>
          <p className="text-sm text-blue-800">
            This prescription will be active immediately and can be filled by a pharmacist or revoked by you.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/prescriptions')}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? 'Creating...' : 'Create Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
}