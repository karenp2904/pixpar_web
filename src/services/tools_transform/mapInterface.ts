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

export function mapToSpanish(values: TransformValues): Partial<ValoresTransformacion> & { transformaciones?: string } {
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

  const cleaned = cleanObject(mapped);

  // 🔑 Construir cadena de transformaciones
  const transformaciones: string[] = [];
  if (cleaned.rotacion !== undefined) transformaciones.push(`rotar_${cleaned.rotacion}`);
  if (cleaned.brillo !== undefined) transformaciones.push(`brillo_${cleaned.brillo}`);
  if (cleaned.contraste !== undefined) transformaciones.push(`contraste_${cleaned.contraste}`);
  if (cleaned.saturacion !== undefined) transformaciones.push(`saturacion_${cleaned.saturacion}`);
  if (cleaned.escalaGrises) transformaciones.push(`escala_grises`);
  if (cleaned.desenfoque !== undefined) transformaciones.push(`desenfoque_${cleaned.desenfoque}`);
  if (cleaned.nitidez !== undefined) transformaciones.push(`nitidez_${cleaned.nitidez}`);
  if (cleaned.recorte) transformaciones.push(`recorte_${cleaned.recorte.ancho}x${cleaned.recorte.alto}`);
  if (cleaned.marcaAgua) transformaciones.push(`marca_agua_${cleaned.marcaAgua.texto}`);

  return {
    ...cleaned,
    transformaciones: transformaciones.length > 0 ? transformaciones.join(", ") : undefined,
  };
}



export function buildTransformacionesString(values: Partial<ValoresTransformacion>): string {
  const parts: string[] = [];

  if (values.rotacion) parts.push(`rotar_${values.rotacion}`);
  if (values.brillo) parts.push(`brillo_${values.brillo}`);
  if (values.contraste) parts.push(`contraste_${values.contraste}`);
  if (values.saturacion) parts.push(`saturacion_${values.saturacion}`);
  if (values.escalaGrises) parts.push(`escala_grises`);
  if (values.desenfoque) parts.push(`desenfoque_${values.desenfoque}`);
  if (values.nitidez) parts.push(`nitidez_${values.nitidez}`);

  if (values.recorte) {
    parts.push(`recorte_${values.recorte.ancho}x${values.recorte.alto}`);
  }

  if (values.marcaAgua) {
    parts.push(`marca_agua_${values.marcaAgua.texto}_${values.marcaAgua.x}x${values.marcaAgua.y}`);
  }

  return parts.join(", ");
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
