export const Select = ({ label, options = [], error, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <select className="border p-2 w-full" {...props}>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500">{error}</p>}
  </div>
);