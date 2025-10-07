export default interface TransformValues {
  brightness?: number;     // Brillo (0–200)
  contrast?: number;       // Contraste (0–200)
  saturation?: number;     // Saturación (0–200)
  rotation?: number;       // Rotación (grados)
  format?: string;         // Formato de salida (JPEG, PNG, etc.)
  blur?: number;           // Desenfoque
  sharpen?: number;        // Nitidez

  // Escala de grises (booleano)
  grayscale?: boolean;

  // Reflejar imagen
  flipHorizontal?: boolean; // Reflejar horizontalmente
  flipVertical?: boolean;   // Reflejar verticalmente

  // Redimensionar imagen
  resize?: {
    width?: number;   // Nuevo ancho en píxeles
    height?: number;  // Nueva altura en píxeles
  };

  // Recorte con posiciones completas
  crop?: {
    left?: number;    // Distancia desde el borde izquierdo
    top?: number;     // Distancia desde el borde superior
    right?: number;   // Distancia desde el borde derecho
    bottom?: number;  // Distancia desde el borde inferior
  };

  // Marca de agua
  watermark?: {
    text?: string;  // Texto de la marca de agua
    x?: number;     // Posición horizontal
    y?: number;     // Posición vertical
  };
}
