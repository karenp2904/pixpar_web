import React from "react";

import type { SelectedImage } from "./BatchImageSelector";
import "../style/selectedImage.css";

interface SelectedImageProps {
  image: SelectedImage | null;
}

const SelectedImageForBatch: React.FC<SelectedImageProps> = ({ image }) => {
  if (!image) return null; // Si no hay imagen, no renderiza nada

  return (
    <div className="selected-image-container">
      <img src={image.src} alt="Imagen seleccionada" className="selected-image" />
    </div>
  );
};


export default SelectedImageForBatch;
