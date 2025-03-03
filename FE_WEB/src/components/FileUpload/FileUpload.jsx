import React, { useState } from "react";
import "./FileUpload.css";

const FileUpload = ({ onFileSelect, className }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file); // 부모 컴포넌트로 선택된 파일 전달
    }
  };

  return (
    <div className={`file-upload ${className}`}>
      <label htmlFor="file-input" className="file-upload-label">
        파일 선택
      </label>
      <input
        id="file-input"
        type="file"
        className="file-upload-input"
        onChange={handleFileChange}
      />
      {selectedFile && (
        <div className="file-details">
          <span>파일명: {selectedFile.name}</span>,{" "}
          <span>크기: {(selectedFile.size / 1024).toFixed(2)} KB</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
