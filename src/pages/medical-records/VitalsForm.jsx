import { useForm } from 'react-hook-form';
import { medicalRecordApi } from '../../api/medicalRecordApi';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Field = ({ label, unit, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
      {unit && <span className="ml-1 text-slate-400 font-normal">({unit})</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
  </div>
);

export default function VitalsForm({ recordId, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Remove empty fields so backend doesn't complain
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );
    if (payload.heartRate) payload.heartRate = parseInt(payload.heartRate);
    if (payload.spo2) payload.spo2 = parseInt(payload.spo2);
    if (payload.weight) payload.weight = parseFloat(payload.weight);
    if (payload.height) payload.height = parseFloat(payload.height);
    if (payload.temperature) payload.temperature = parseFloat(payload.temperature);

    try {
      const res = await medicalRecordApi.addVitals(recordId, payload);
      toast.success('Vitals updated successfully');
      reset();
      onSuccess?.(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update vitals');
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2 text-sm rounded-lg border ${
      hasError ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
    } focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Field label="Weight" unit="kg" error={errors.weight}>
          <input
            type="number"
            step="0.1"
            className={inputClass(errors.weight)}
            placeholder="e.g. 70"
            {...register('weight', {
              min: { value: 0.1, message: 'Must be > 0' },
            })}
          />
        </Field>

        <Field label="Height" unit="cm" error={errors.height}>
          <input
            type="number"
            step="0.1"
            className={inputClass(errors.height)}
            placeholder="e.g. 170"
            {...register('height', {
              min: { value: 0.1, message: 'Must be > 0' },
            })}
          />
        </Field>

        <Field label="Temperature" unit="°C" error={errors.temperature}>
          <input
            type="number"
            step="0.1"
            className={inputClass(errors.temperature)}
            placeholder="e.g. 37.0"
            {...register('temperature', {
              min: { value: 0.1, message: 'Must be > 0' },
            })}
          />
        </Field>

        <Field label="Blood Pressure" unit="mmHg" error={errors.bloodPressure}>
          <input
            type="text"
            className={inputClass(errors.bloodPressure)}
            placeholder="e.g. 120/80"
            {...register('bloodPressure', {
              pattern: {
                value: /^\d{2,3}\/\d{2,3}$/,
                message: 'Format: 120/80',
              },
            })}
          />
        </Field>

        <Field label="Heart Rate" unit="bpm" error={errors.heartRate}>
          <input
            type="number"
            className={inputClass(errors.heartRate)}
            placeholder="e.g. 72"
            {...register('heartRate', {
              min: { value: 20, message: 'Min 20' },
              max: { value: 300, message: 'Max 300' },
            })}
          />
        </Field>

        <Field label="SpO₂" unit="%" error={errors.spo2}>
          <input
            type="number"
            className={inputClass(errors.spo2)}
            placeholder="e.g. 98"
            {...register('spo2', {
              min: { value: 50, message: 'Min 50' },
              max: { value: 100, message: 'Max 100' },
            })}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          Save Vitals
        </button>
      </div>
    </form>
  );
}