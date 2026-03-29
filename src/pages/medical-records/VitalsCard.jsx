import { Activity, Thermometer, Heart, Wind, Scale, Ruler } from 'lucide-react';

const VitalTile = ({ icon: Icon, label, value, unit, color }) => (
  <div className={`flex items-center gap-3 p-4 rounded-xl border ${color.bg} ${color.border}`}>
    <div className={`p-2 rounded-lg ${color.iconBg}`}>
      <Icon size={18} className={color.iconText} />
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      {value != null ? (
        <p className={`text-lg font-semibold ${color.text}`}>
          {value}
          <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>
        </p>
      ) : (
        <p className="text-sm text-slate-400 italic">Not recorded</p>
      )}
    </div>
  </div>
);

export default function VitalsCard({ record }) {
  const vitals = [
    {
      icon: Scale,
      label: 'Weight',
      value: record?.weight,
      unit: 'kg',
      color: {
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
        text: 'text-blue-700',
      },
    },
    {
      icon: Ruler,
      label: 'Height',
      value: record?.height,
      unit: 'cm',
      color: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        iconBg: 'bg-emerald-100',
        iconText: 'text-emerald-600',
        text: 'text-emerald-700',
      },
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: record?.bloodPressure,
      unit: 'mmHg',
      color: {
        bg: 'bg-red-50',
        border: 'border-red-100',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600',
        text: 'text-red-700',
      },
    },
    {
      icon: Heart,
      label: 'Heart Rate',
      value: record?.heartRate,
      unit: 'bpm',
      color: {
        bg: 'bg-rose-50',
        border: 'border-rose-100',
        iconBg: 'bg-rose-100',
        iconText: 'text-rose-600',
        text: 'text-rose-700',
      },
    },
    {
      icon: Wind,
      label: 'SpO₂',
      value: record?.spo2,
      unit: '%',
      color: {
        bg: 'bg-purple-50',
        border: 'border-purple-100',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
        text: 'text-purple-700',
      },
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: record?.temperature,
      unit: '°C',
      color: {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        iconBg: 'bg-amber-100',
        iconText: 'text-amber-600',
        text: 'text-amber-700',
      },
    },
  ];

  const hasAnyVital = vitals.some((v) => v.value != null);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
        Vitals
      </h3>
      {!hasAnyVital ? (
        <div className="text-center py-6 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
          No vitals recorded for this visit
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {vitals.map((v) => (
            <VitalTile key={v.label} {...v} />
          ))}
        </div>
      )}
    </div>
  );
}