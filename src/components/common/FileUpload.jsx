import { useState } from 'react';
import PropTypes from 'prop-types';
import { UploadCloud, FileText } from 'lucide-react';

const FileUpload = ({ onFile, label = "Upload Document" }) => {
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      setFileName(file.name);
      onFile(file);
    }
  };

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFile(e); }}
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all group cursor-pointer"
      >
        <input type="file" id="file-up" className="hidden" onChange={handleFile} />
        <label htmlFor="file-up" className="flex flex-col items-center cursor-pointer">
          {fileName ? <FileText className="text-blue-600 mb-2" size={32} /> : <UploadCloud className="text-gray-400 group-hover:text-blue-500 mb-2" size={32} />}
          <p className="text-sm font-medium text-gray-600">{fileName || "Click to browse or drag file here"}</p>
          <p className="text-xs text-gray-400 mt-1 uppercase">PDF, DOCX up to 10MB</p>
        </label>
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  onFile: PropTypes.func.isRequired,
  label: PropTypes.string
};

export default FileUpload;