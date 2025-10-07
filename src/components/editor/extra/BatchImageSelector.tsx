import React, { useState } from "react"; 
import { v4 as uuidv4 } from "uuid";
import "../style/BatchImageSelector.css";

export interface SelectedImage {
  id: string;
  src: string;
  file: File;
}

interface BatchImageSelectorProps {
  onSelect: (images: SelectedImage[]) => void;
}

const BatchImageSelector: React.FC<BatchImageSelectorProps> = ({ onSelect }) => {
  const [allImages, setAllImages] = useState<SelectedImage[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newImages: SelectedImage[] = files.map((file) => ({
      id: uuidv4(),
      src: URL.createObjectURL(file),
      file,
    }));

    // ✅ anexar, no reemplazar
    const updatedImages = [...allImages, ...newImages];
    setAllImages(updatedImages);
    onSelect(updatedImages);

    // opcional: limpiar el input para permitir volver a subir los mismos archivos
    e.target.value = "";
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
