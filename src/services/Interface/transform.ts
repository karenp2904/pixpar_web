export default interface TransformValues {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  rotation?: number;
  format?: string;
  grayscale?: number; // ahora SIEMPRE será un número (0-100)
  blur?: number;
  sharpen?: number;

  // Recorte (x, y = posición inicial, width y height = tamaño del recorte)
  crop?: { 
    width?: number; 
    height?: number; 
  };

  // Marca de agua
  watermark?: {
    text?: string;   // Texto de la marca de agua
    x?: number;      // Posición horizontal
    y?: number;      // Posición vertical
  };
}
