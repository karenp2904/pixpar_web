import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../style/batchImageSelector.css";

export interface SelectedImage {
  id: string;
  src: string;
  file: File; //  nuevo
}

interface BatchImageSelectorProps {
  onSelect: (images: SelectedImage[]) => void;
}

const BatchImageSelector: React.FC<BatchImageSelectorProps> = ({ onSelect }) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newImages: SelectedImage[] = files.map((file) => ({
      id: uuidv4(),
      src: URL.createObjectURL(file),
      file,
    }));

    onSelect(newImages);
  };

  return (
    <div className="batch-selector">
      <label className="batch-upload-label">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden-input"
        />
        <span className="batch-upload-button">📂 Seleccionar imágenes</span>
      </label>
    </div>
  );
};

export default BatchImageSelector;
