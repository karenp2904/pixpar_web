import React from "react";
import type { SelectedImage } from "./BatchImageSelector";
import "../style/selectedgaller.css";

interface SelectedGalleryProps {
  images: SelectedImage[];
  selectedImage: SelectedImage | null;
  onSelect: (img: SelectedImage) => void;
  onRemove: (id: string) => void;
}

const SelectedGallery: React.FC<SelectedGalleryProps> = ({
  images,
  selectedImage,
  onSelect,
  onRemove,
}) => {
  if (images.length === 0) {
    return <div className="gallery-container empty-gallery">No hay imágenes seleccionadas</div>;
  }

  return (
    <div className="gallery-container">
      {images.map((img) => (
        <div
          key={img.id}
          className={`thumbnail ${selectedImage?.id === img.id ? "active" : ""}`}
          onClick={() => onSelect(img)}
        >
          <img src={img.src} alt="miniatura" />
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(img.id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedGallery;
