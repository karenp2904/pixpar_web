import type TransformValues from "../Interface/transform"; 
import type ValoresTransformacion from "../Interface/Transformacion";

function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value === 0 || value === '' || value === undefined || value === null) continue;

    // Si es objeto, aplicar limpieza recursiva
    if (typeof value === 'object' && !Array.isArray(value)) {
      const cleaned = cleanObject(value);
      if (Object.keys(cleaned).length > 0) {
        result[key] = cleaned as T[typeof key];
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function mapToSpanish(values: TransformValues): Partial<ValoresTransformacion> {
  const mapped = {
    brillo: values.brightness,
    contraste: values.contrast,
    saturacion: values.saturation,
    rotacion: values.rotation,
    formato: values.format,
    escalaGrises: values.grayscale,
    desenfoque: values.blur,
    nitidez: values.sharpen,
    recorte: values.crop
      ? { ancho: values.crop.width, alto: values.crop.height }
      : undefined,
    marcaAgua: values.watermark
      ? { texto: values.watermark.text, x: values.watermark.x, y: values.watermark.y }
      : undefined,
  };
  return cleanObject(mapped);
}

export function mapToEnglish(values: ValoresTransformacion): Partial<TransformValues> {
  const mapped = {
    brightness: values.brillo,
    contrast: values.contraste,
    saturation: values.saturacion,
    rotation: values.rotacion,
    format: values.formato,
    grayscale: values.escalaGrises,
    blur: values.desenfoque,
    sharpen: values.nitidez,
    crop: values.recorte
      ? { width: values.recorte.ancho, height: values.recorte.alto }
      : undefined,
    watermark: values.marcaAgua
      ? { text: values.marcaAgua.texto, x: values.marcaAgua.x, y: values.marcaAgua.y }
      : undefined,
  };
  return cleanObject(mapped);
}
