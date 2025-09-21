import React from "react";
import "../style/format.css"

interface FormatSelectorProps {
  selectedFormat: string;
  onChange: (format: string) => void;
}

const formats = ["JPG", "PNG", "TIFF"];

const FormatSelector: React.FC<FormatSelectorProps> = ({ selectedFormat, onChange }) => {
  return (
    <div className="format-selector">
      {formats.map((fmt) => (
        <button
          key={fmt}
          className={`format-btn ${selectedFormat === fmt ? "active" : ""}`}
          onClick={() => onChange(fmt)}
        >
          {fmt}
        </button>
      ))}
    </div>
  );
};

export default FormatSelector;
