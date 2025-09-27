import React, { useState, useEffect, useRef } from "react";
import type TransformValues from "../../../services/Interface/transform";
import "./TransformControls.css";
import FormatSelector from "../../../components/editor/extra/FormatSelector";

interface TransformControlsProps {
  selectedImageIndex: number;
  totalImages: number;
  onChangeImage: (index: number) => void;
  onTransformChange: (values: TransformValues) => void;
  savedTransform?: TransformValues;
}

const INITIAL_VALUES: TransformValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  rotation: 0,
  format: "JPG",
  grayscale: 0,
  blur: 0,
  sharpen: 0,
  crop: { width: 0, height: 0 },
  watermark: { text: "", x: 0, y: 0 },
};

const TransformControls: React.FC<TransformControlsProps> = ({
  selectedImageIndex,
  totalImages,
  onChangeImage,
  onTransformChange,
  savedTransform,
}) => {
  const [values, setValues] = useState<TransformValues>(
    savedTransform || INITIAL_VALUES
  );

  // Sincroniza si savedTransform cambia externamente
  useEffect(() => {
    if (savedTransform) setValues(savedTransform);
    else setValues(INITIAL_VALUES);
  }, [savedTransform]);

  const updateValue = (key: keyof TransformValues, val: any) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  // Debounce para evitar llamar al padre en cada cambio
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onTransformChange(values); // guarda solo después de X ms
    }, 1000); // <-- ajusta a 500, 2000, 5000 ms según necesites

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [values, onTransformChange]);
 
  return (
    <div className="transform-controls">
      <h3>Transformaciones</h3>

      {/* === Grupo Brillo / Contraste === */}
      <div className="inline-group">
        <div className="control">
          <label>Brillo</label>
          <input
            type="range"
            min={-100}
            max={100}
            value={values.brightness}
            onChange={(e) => updateValue("brightness", Number(e.target.value))}
          />
          <input
            type="number"
            value={values.brightness}
            onChange={(e) => updateValue("brightness", Number(e.target.value))}
          />
        </div>

        <div className="control">
          <label>Contraste</label>
          <input
            type="range"
            min={-100}
            max={100}
            value={values.contrast}
            onChange={(e) => updateValue("contrast", Number(e.target.value))}
          />
          <input
            type="number"
            value={values.contrast}
            onChange={(e) => updateValue("contrast", Number(e.target.value))}
          />
        </div>
      </div>

      {/* === Saturación / Nitidez === */}
      <div className="inline-group">
        <div className="control">
          <label>Saturación</label>
          <input
            type="range"
            min={-100}
            max={100}
            value={values.saturation}
            onChange={(e) => updateValue("saturation", Number(e.target.value))}
          />
          <input
            type="number"
            value={values.saturation}
            onChange={(e) => updateValue("saturation", Number(e.target.value))}
          />
        </div>

        <div className="control">
          <label>Nitidez</label>
          <input
            type="range"
            min={0}
            max={100}
            value={values.sharpen}
            onChange={(e) => updateValue("sharpen", Number(e.target.value))}
          />
          <input
            type="number"
            value={values.sharpen}
            onChange={(e) => updateValue("sharpen", Number(e.target.value))}
          />
        </div>
      </div>

      {/* === Desenfoque / Rotación === */}
      <div className="inline-group">
        <div className="control">
          <label>Desenfoque</label>
          <input
            type="range"
            min={0}
            max={20}
            value={values.blur}
            onChange={(e) => updateValue("blur", Number(e.target.value))}
          />
          <input
            type="number"
            value={values.blur}
            onChange={(e) => updateValue("blur", Number(e.target.value))}
          />
        </div>

        <div className="control">
          <label>Rotación</label>
          <input
            type="range"
            min={-180}
            max={180}
            value={values.rotation}
            onChange={(e) => updateValue("rotation", Number(e.target.value))}
          />
          <input
            type="number"
            value={values.rotation}
            onChange={(e) => updateValue("rotation", Number(e.target.value))}
          />
        </div>
      </div>

      {/* === Crop XY / WH === */}
      <h3>Recorte</h3>
   

      <div className="inline-group">
        <div className="control">
          <label>W</label>
          <input
            type="number"
            value={values.crop?.width ?? 0}
            onChange={(e) =>
              updateValue("crop", {
                ...values.crop,
                width: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="control">
          <label>H</label>
          <input
            type="number"
            value={values.crop?.height ?? 0}
            onChange={(e) =>
              updateValue("crop", {
                ...values.crop,
                height: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* === Marca de Agua === */}
      <h3>Marca de Agua</h3>
      <input
        type="text"
        placeholder="Texto..."
        value={values.watermark?.text ?? ""}
        onChange={(e) =>
          updateValue("watermark", {
            ...values.watermark,
            text: e.target.value,
          })
        }
      />

      <div className="inline-group">
        <div className="control">
          <label>X</label>
          <input
            type="number"
            value={values.watermark?.x ?? 0}
            onChange={(e) =>
              updateValue("watermark", {
                ...values.watermark,
                x: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="control">
          <label>Y</label>
          <input
            type="number"
            value={values.watermark?.y ?? 0}
            onChange={(e) =>
              updateValue("watermark", {
                ...values.watermark,
                y: Number(e.target.value),
              })
            }
          />
        </div>

        
      </div>

      
      <div className="format-wrapper">
        <h4>Formato de Salida</h4>
        <FormatSelector
          selectedFormat={values.format ?? "JPG"}
          onChange={(fmt) => updateValue("format", fmt)}
        />
      </div>

    

      {/* === Navegación de imágenes === */}
      <div className="gallery-nav">
        <button
          className="nav-btn"
          onClick={() => onChangeImage(selectedImageIndex - 1)}
          disabled={selectedImageIndex === 0}
        >
          ← Anterior
        </button>
        <span>
          {selectedImageIndex + 1} / {totalImages}
        </span>
        <button
          className="nav-btn"
          onClick={() => onChangeImage(selectedImageIndex + 1)}
          disabled={selectedImageIndex === totalImages - 1}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default TransformControls;
