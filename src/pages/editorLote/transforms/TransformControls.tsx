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
  brightness: 0,       // Nivel normal (0–200)
  contrast: 0,
  saturation: 0,
  rotation: 0,
  format: "jpg",
  blur: 0,

  sharpen: 0,
  grayscale: false,       // Ahora es boolean

  flipHorizontal: false,  // Reflejar horizontalmente
  flipVertical: false,    // Reflejar verticalmente

  resize: {
    width: 0,
    height: 0,
  },

  crop: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  watermark: {
    text: "",
    x: 0,
    y: 0,
  },
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


  const updateValue = (
    key: keyof TransformValues,
    value: any,
    extra?: Partial<TransformValues>
  ) => {
    setValues((prev) => ({
      ...prev,
      ...extra,
      [key]: value,
    }));
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
            min={0}
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
            min={0}
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
            min={0}
            max={10}
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
            max={10}
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
            max={10}
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
            min={-360}
            max={360}
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

      {/* Sección: Reflejar */}
      <div className="inline-group">
        <h3>Reflejar</h3>

        <div className="transform-toggles">
          {/* Reflejar Horizontal */}
          <button
            className={`toggle-btn ${values.flipHorizontal ? "active" : ""}`}
            onClick={() =>
              updateValue("flipHorizontal", !values.flipHorizontal, {
                flipVertical: false,
              })
            }
          >
            <span>↔</span> Horizontal
          </button>

          {/* Reflejar Vertical */}
          <button
            className={`toggle-btn ${values.flipVertical ? "active" : ""}`}
            onClick={() =>
              updateValue("flipVertical", !values.flipVertical, {
                flipHorizontal: false,
              })
            }
          >
            <span>↕</span> Vertical
          </button>
        </div>
      </div>

      {/* Sección: Escala de grises */}
      <div className="inline-group">
        <h3>Escala de Grises</h3>

        <div className="switch-control">
          <label className="switch">
            <input
              type="checkbox"
              checked={values.grayscale ?? false}
              onChange={(e) => updateValue("grayscale", e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span className="label-text">Activar</span>
        </div>
      </div>



      {/* === Crop XY / WH === */}
      <h3>Redimensionar</h3>

      <div className="inline-group">
        <div className="control">
          <label>W</label>
          <input
            type="number"
            min={1}
            value={values.resize?.width ?? 0}
            onChange={(e) =>
              updateValue("resize", {
                ...values.resize,
                width: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="control">
          <label>H</label>
          <input
            type="number"
            min={1}
            value={values.resize?.height ?? 0}
            onChange={(e) =>
              updateValue("resize", {
                ...values.resize,
                height: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* recortar*/  }
      <h3>Recorte</h3>

      {/* Primera fila: Left y Top */}
      <div className="inline-group">
        <div className="control">
          <label>Izquierda</label>
          <input
            type="number"
            min={0}
            value={values.crop?.left ?? 0}
            onChange={(e) =>
              updateValue("crop", {
                ...values.crop,
                left: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="control">
          <label>Arriba</label>
          <input
            type="number"
            min={0}
            value={values.crop?.top ?? 0}
            onChange={(e) =>
              updateValue("crop", {
                ...values.crop,
                top: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Segunda fila: Right y Bottom */}
      <div className="inline-group">
        <div className="control">
          <label>Derecha</label>
          <input
            type="number"
            min={0}
            value={values.crop?.right ?? 0}
            onChange={(e) =>
              updateValue("crop", {
                ...values.crop,
                right: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="control">
          <label>Abajo</label>
          <input
            type="number"
            min={0}
            value={values.crop?.bottom ?? 0}
            onChange={(e) =>
              updateValue("crop", {
                ...values.crop,
                bottom: Number(e.target.value),
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
