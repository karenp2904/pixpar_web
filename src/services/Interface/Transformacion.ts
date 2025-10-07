// src/services/Interface/transformaciones.ts
export default interface ValoresTransformacion {
  brillo?: number;          // Brillo (0–200)
  contraste?: number;       // Contraste (0–200)
  saturacion?: number;      // Saturación (0–200)
  rotacion?: number;        // Rotación en grados
  formato?: string;         // Formato de salida: "jpg", "png", etc.
  desenfoque?: number;      // Intensidad del desenfoque
  nitidez?: number;         // Intensidad de enfoque o realce

  // Escala de grises (true = aplicar, false = mantener color)
  escalaGrises?: boolean;

  // Reflejar imagen
  reflejarHorizontal?: boolean; // Reflejar de izquierda a derecha
  reflejarVertical?: boolean;   // Reflejar de arriba a abajo

  // Redimensionar imagen
  redimensionar?: {
    ancho?: number;   // Nuevo ancho en píxeles
    alto?: number;    // Nueva altura en píxeles
  };

  // Recorte con posiciones completas
  recorte?: {
    left?: number;    // Distancia desde el borde izquierdo
    top?: number;     // Distancia desde el borde superior
    right?: number;   // Distancia desde el borde derecho
    bottom?: number;  // Distancia desde el borde inferior
  };

  // Marca de agua
  marcaAgua?: {
    texto?: string;   // Texto de la marca de agua
    x?: number;       // Posición horizontal
    y?: number;       // Posición vertical
  };
}

