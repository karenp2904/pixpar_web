import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg  from "../../../services/tools_transform/cropImage";
import "../style/crop.css";

interface CropToolProps {
  image: string; // URL de la imagen seleccionada
  onClose: () => void;
  onConfirm: (croppedImage: string) => void; // devuelve la imagen recortada
}

const CropTool: React.FC<CropToolProps> = ({ image, onClose, onConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onConfirm(croppedImage);
    } catch (e) {
      console.error("Error al recortar la imagen:", e);
    }
  };

  return (
    <div className="crop-modal">
      <div className="crop-container">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1} // relación 1:1, se puede parametrizar
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>

      <div className="crop-controls">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <div className="crop-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="apply-btn" onClick={handleConfirm}>
            ✅ Aplicar recorte
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropTool;
