import React from "react";

interface ImageSelectorProps {
  onSelect: (file: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onSelect }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onSelect(url);
    }
  };

  return (
    <div className="image-selector">
      <p>📂 Selecciona o arrastra una imagen</p>
      <input type="file" accept="image/*" onChange={handleFile} />
    </div>
  );
};

export default ImageSelector;
