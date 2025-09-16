import React, { useState, useEffect } from "react";
import transformService from "../../../services/transformService";
import "./TransformControls.css";
import type TransformValues from "../../../services/Interface/trasnforms";

interface TransformControlsProps {
  selectedImageIndex: number;
  totalImages: number;
  savedTransform?: TransformValues;
  onChangeImage: (newIndex: number) => void;
  onTransformChange: (values: TransformValues) => void;
}

const DEFAULT_VALUES: TransformValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  rotation: 0,
  format: "png",
  grayscale: false,
  flipH: false,
  flipV: false,
  blur: 0,
  sharpen: 0,
};

const TransformControls: React.FC<TransformControlsProps> = ({
  selectedImageIndex,
  totalImages,
  savedTransform,
  onChangeImage,
  onTransformChange,
}) => {
  const [values, setValues] = useState<TransformValues>(
    savedTransform || DEFAULT_VALUES
  );

  useEffect(() => {
    setValues(savedTransform || DEFAULT_VALUES);
  }, [savedTransform]);

  const handleChange = (key: keyof TransformValues, newValue: any) => {
    const updated = { ...values, [key]: newValue };
    setValues(updated);
    onTransformChange(updated);
  };

  const handleReplicatePrevious = () => {
    if (selectedImageIndex <= 0) return;
    const all = transformService.getAllTransforms();
    const prevId = Object.keys(all)[selectedImageIndex - 1];
    if (prevId && all[prevId]) {
      setValues(all[prevId]);
      onTransformChange(all[prevId]);
    }
  };

  return (
    <div className="transform-controls">
      <h3>Ajustes de Transformación</h3>

      {/* Escala de grises */}
      <div className="control">
        <label>
          <input
            type="checkbox"
            checked={values.grayscale}
            onChange={(e) => handleChange("grayscale", e.target.checked)}
          />
          Escala de grises
        </label>
      </div>

      {/* Brillo / Contraste / Saturación */}
      <div className="control">
        <label>Brillo</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={values.brightness}
          onChange={(e) => handleChange("brightness", Number(e.target.value))}
        />
        <span>{values.brightness}%</span>
      </div>

      <div className="control">
        <label>Contraste</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={values.contrast}
          onChange={(e) => handleChange("contrast", Number(e.target.value))}
        />
        <span>{values.contrast}%</span>
      </div>

      <div className="control">
        <label>Saturación</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={values.saturation}
          onChange={(e) => handleChange("saturation", Number(e.target.value))}
        />
        <span>{values.saturation}%</span>
      </div>

      {/* Rotación */}
      <div className="control">
        <label>Rotación</label>
        <input
          type="range"
          min="0"
          max="360"
          value={values.rotation}
          onChange={(e) => handleChange("rotation", Number(e.target.value))}
        />
        <span>{values.rotation}°</span>
      </div>

      {/* Reflejar */}
      <div className="control">
        <label>
          <input
            type="checkbox"
            checked={values.flipH}
            onChange={(e) => handleChange("flipH", e.target.checked)}
          />
          Reflejo Horizontal
        </label>
        <label>
          <input
            type="checkbox"
            checked={values.flipV}
            onChange={(e) => handleChange("flipV", e.target.checked)}
          />
          Reflejo Vertical
        </label>
      </div>

      {/* Desenfoque */}
      <div className="control">
        <label>Desenfoque</label>
        <input
          type="range"
          min="0"
          max="20"
          value={values.blur}
          onChange={(e) => handleChange("blur", Number(e.target.value))}
        />
      </div>

      {/* Nitidez */}
      <div className="control">
        <label>Nitidez</label>
        <input
          type="range"
          min="0"
          max="10"
          value={values.sharpen}
          onChange={(e) => handleChange("sharpen", Number(e.target.value))}
        />
      </div>

      {/* Redimensionar */}
      <div className="control resize">
        <label>Ancho</label>
        <input
          type="number"
          min="1"
          value={values.resizeWidth || ""}
          onChange={(e) => handleChange("resizeWidth", Number(e.target.value))}
        />
        <label>Alto</label>
        <input
          type="number"
          min="1"
          value={values.resizeHeight || ""}
          onChange={(e) => handleChange("resizeHeight", Number(e.target.value))}
        />
      </div>

      {/* Texto / Marca de agua */}
      <div className="control">
        <label>Marca de agua</label>
        <input
          type="text"
          placeholder="Escribe el texto"
          value={values.watermarkText || ""}
          onChange={(e) => handleChange("watermarkText", e.target.value)}
        />
      </div>

      {/* Formato */}
      <div className="format-selector">
        <span>Formato</span>
        <div className="format-buttons">
          {["jpg", "png", "tif"].map((fmt) => (
            <button
              key={fmt}
              className={values.format === fmt ? "active" : ""}
              onClick={() => handleChange("format", fmt)}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Navegación */}
      <div className="gallery-nav">
        <button
          className="nav-btn"
          disabled={selectedImageIndex <= 0}
          onClick={() => onChangeImage(selectedImageIndex - 1)}
        >
          ⬅️ Anterior
        </button>
        <span>
          {selectedImageIndex + 1} / {totalImages}
        </span>
        <button
          className="nav-btn"
          disabled={selectedImageIndex >= totalImages - 1}
          onClick={() => onChangeImage(selectedImageIndex + 1)}
        >
          Siguiente ➡️
        </button>
      </div>

      {/* Replicar anterior */}
      <button
        className="apply-btn"
        onClick={handleReplicatePrevious}
        disabled={selectedImageIndex <= 0}
      >
        🔁 Replicar anterior
      </button>
    </div>
  );
};

export default TransformControls;
