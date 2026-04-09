import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { medicalRecordApi } from '../../api/medicalRecordApi';
import { ArrowLeft, Loader2, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

const Field = ({ label, required, hint, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {hint && <span className="ml-1 text-xs text-slate-400 font-normal">{hint}</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border ${
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
  } focus:outline-none focus:ring-2 bg-white transition-colors`;

const textareaClass = (hasError) => inputClass(hasError) + ' resize-none';

export default function CreateMedicalRecord() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Clean up empty optional fields
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );
    if (payload.weight) payload.weight = parseFloat(payload.weight);
    if (payload.height) payload.height = parseFloat(payload.height);
    if (payload.temperature) payload.temperature = parseFloat(payload.temperature);
    if (payload.heartRate) payload.heartRate = parseInt(payload.heartRate);
    if (payload.spo2) payload.spo2 = parseInt(payload.spo2);

    try {
      const res = await medicalRecordApi.create(payload);
      toast.success('Medical record created');
      navigate(`/medical-records/${res.data.data.id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create record');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/medical-records')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100">
            <Stethoscope size={18} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">New Medical Record</h1>
            <p className="text-xs text-slate-400">Fill in the visit details below</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* --- Patient & Doctor --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Patient & Doctor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Patient ID" required error={errors.patientId}>
              <input
                className={inputClass(errors.patientId)}
                placeholder="UUID"
                {...register('patientId', { required: 'Patient ID is required' })}
              />
            </Field>
            <Field label="Doctor ID" required error={errors.doctorId}>
              <input
                className={inputClass(errors.doctorId)}
                placeholder="UUID"
                {...register('doctorId', { required: 'Doctor ID is required' })}
              />
            </Field>
            <Field label="Appointment ID" hint="(optional)" error={errors.appointmentId}>
              <input
                className={inputClass(errors.appointmentId)}
                placeholder="UUID — leave blank if none"
                {...register('appointmentId')}
              />
            </Field>
            <Field label="Visit Date" error={errors.visitDate}>
              <input
                type="date"
                className={inputClass(errors.visitDate)}
                {...register('visitDate')}
              />
            </Field>
          </div>
        </div>

        {/* --- Clinical Notes --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Clinical Notes</h2>

          <Field label="Chief Complaint" error={errors.chiefComplaint}>
            <textarea
              rows={2}
              className={textareaClass(errors.chiefComplaint)}
              placeholder="What brought the patient in?"
              {...register('chiefComplaint', { maxLength: { value: 1000, message: 'Max 1000 characters' } })}
            />
          </Field>

          <Field label="Symptoms" error={errors.symptoms}>
            <textarea
              rows={2}
              className={textareaClass(errors.symptoms)}
              placeholder="Observed and reported symptoms"
              {...register('symptoms', { maxLength: { value: 2000, message: 'Max 2000 characters' } })}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Field label="Diagnosis" error={errors.diagnosis}>
                <textarea
                  rows={2}
                  className={textareaClass(errors.diagnosis)}
                  placeholder="Clinical diagnosis"
                  {...register('diagnosis', { maxLength: { value: 2000, message: 'Max 2000 characters' } })}
                />
              </Field>
            </div>
            <Field label="ICD-10 Code" hint="e.g. J00" error={errors.icd10Code}>
              <input
                className={inputClass(errors.icd10Code)}
                placeholder="e.g. J00"
                {...register('icd10Code', { maxLength: { value: 20, message: 'Max 20 chars' } })}
              />
            </Field>
          </div>

          <Field label="Treatment Plan" error={errors.treatmentPlan}>
            <textarea
              rows={3}
              className={textareaClass(errors.treatmentPlan)}
              placeholder="Recommended treatment and management plan"
              {...register('treatmentPlan', { maxLength: { value: 2000, message: 'Max 2000 characters' } })}
            />
          </Field>

          <Field label="Follow-up Date" hint="(optional)" error={errors.followUpDate}>
            <input
              type="date"
              className={inputClass(errors.followUpDate)}
              {...register('followUpDate')}
            />
          </Field>
        </div>

        {/* --- Vitals (optional) --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Vitals</h2>
            <p className="text-xs text-slate-400 mt-0.5">All vitals are optional — can be added later</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Weight" hint="kg" error={errors.weight}>
              <input type="number" step="0.1" className={inputClass(errors.weight)} placeholder="e.g. 70"
                {...register('weight', { min: { value: 0.1, message: 'Must be > 0' } })} />
            </Field>
            <Field label="Height" hint="cm" error={errors.height}>
              <input type="number" step="0.1" className={inputClass(errors.height)} placeholder="e.g. 170"
                {...register('height', { min: { value: 0.1, message: 'Must be > 0' } })} />
            </Field>
            <Field label="Temperature" hint="°C" error={errors.temperature}>
              <input type="number" step="0.1" className={inputClass(errors.temperature)} placeholder="e.g. 37.0"
                {...register('temperature', { min: { value: 0.1, message: 'Must be > 0' } })} />
            </Field>
            <Field label="Blood Pressure" hint="mmHg" error={errors.bloodPressure}>
              <input className={inputClass(errors.bloodPressure)} placeholder="120/80"
                {...register('bloodPressure', {
                  pattern: { value: /^\d{2,3}\/\d{2,3}$/, message: 'Format: 120/80' }
                })} />
            </Field>
            <Field label="Heart Rate" hint="bpm" error={errors.heartRate}>
              <input type="number" className={inputClass(errors.heartRate)} placeholder="e.g. 72"
                {...register('heartRate', {
                  min: { value: 20, message: 'Min 20' },
                  max: { value: 300, message: 'Max 300' }
                })} />
            </Field>
            <Field label="SpO₂" hint="%" error={errors.spo2}>
              <input type="number" className={inputClass(errors.spo2)} placeholder="e.g. 98"
                {...register('spo2', {
                  min: { value: 50, message: 'Min 50' },
                  max: { value: 100, message: 'Max 100' }
                })} />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate('/medical-records')}
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
            {isSubmitting ? 'Saving...' : 'Create Record'}
          </button>
        </div>
      </form>
    </div>
  );
}