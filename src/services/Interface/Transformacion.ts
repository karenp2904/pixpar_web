// src/services/Interface/transformaciones.ts
export default interface ValoresTransformacion {
  brillo?: number;         // Brillo (0-100)
  contraste?: number;      // Contraste (0-100)
  saturacion?: number;     // Saturación (0-100)
  rotacion?: number;       // Rotación en grados
  formato?: string;        // Formato de salida: "jpg", "png", etc.
  escalaGrises?: number;   // Porcentaje de conversión a blanco y negro (0-100)
  desenfoque?: number;     // Intensidad de desenfoque
  nitidez?: number;        // Intensidad de enfoque

  // Recorte de la imagen
  recorte?: { 
    ancho?: number; 
    alto?: number; 
  };

  // Marca de agua
  marcaAgua?: {
    texto?: string;  // Texto de la marca de agua
    x?: number;      // Posición horizontal
    y?: number;      // Posición vertical
  };
}
