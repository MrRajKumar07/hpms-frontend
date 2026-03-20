export const FileUpload = ({ onFile }) => {
  const [drag, setDrag] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    onFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`border p-4 text-center ${drag ? "bg-gray-200" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
    >
      Drag & Drop or Click
      <input type="file" onChange={(e) => onFile(e.target.files[0])} />
    </div>
  );
};