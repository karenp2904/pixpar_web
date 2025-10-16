import type TransformValues from "../Interface/transform";
import type ValoresTransformacion from "../Interface/Transformacion";

function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];

    if (value === 0 || value === "" || value === undefined || value === null) continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      const cleaned = cleanObject(value);
      if (Object.keys(cleaned).length > 0) result[key] = cleaned as T[typeof key];
    } else {
      result[key] = value;
    }
  }
  return result;
}

// 🔄 Español → sistema de procesamiento
export function mapToSpanish(
  values: TransformValues
): Partial<ValoresTransformacion> & { transformaciones?: string } {
  const mapped = {
    brillo: values.brightness ?? 0,
    contraste: values.contrast ?? 0,
    saturacion: values.saturation,
    rotacion: values.rotation,
    formato: values.format,
    escalaGrises: values.grayscale,
    desenfoque: values.blur,
    nitidez: values.sharpen,
    redimensionar: values.resize
      ? { ancho: values.resize.width, alto: values.resize.height }
      : undefined,
    reflejarHorizontal: values.flipHorizontal,
    reflejarVertical: values.flipVertical,
    recorte: values.crop
      ? {
          top: values.crop.top,
          bottom: values.crop.bottom,
          left: values.crop.left,
          right: values.crop.right,
        }
      : undefined,
    marcaAgua: values.watermark
      ? { texto: values.watermark.text, x: values.watermark.x, y: values.watermark.y }
      : undefined,
  };

  const cleaned = cleanObject(mapped);

  // 🧩 Construir lista de transformaciones descriptivas
  const transformaciones: string[] = [];

  if (cleaned.rotacion) transformaciones.push(`rotar_${cleaned.rotacion}°`);

  // 🔆 Agrupamos brillo y contraste como una sola transformación
  if (cleaned.brillo !== undefined || cleaned.contraste !== undefined) {
    transformaciones.push(
      `ajustar_brillo_${cleaned.brillo ?? 0}_contraste_${cleaned.contraste ?? 0}`
    );
  }

  if (cleaned.saturacion) transformaciones.push(`ajustar_saturacion_${cleaned.saturacion}`);
  if (cleaned.escalaGrises) transformaciones.push("escala_grises");
  if (cleaned.desenfoque) transformaciones.push(`desenfoque_${cleaned.desenfoque}`);
  if (cleaned.nitidez) transformaciones.push(`ajustar_nitidez_${cleaned.nitidez}`);
  if (cleaned.reflejarHorizontal) transformaciones.push("reflejar_horizontal");
  if (cleaned.reflejarVertical) transformaciones.push("reflejar_vertical");
  if (cleaned.redimensionar)
    transformaciones.push(
      `redimensionar_${cleaned.redimensionar.ancho}x${cleaned.redimensionar.alto}`
    );
  if (cleaned.recorte)
    transformaciones.push(
      `recorte_top${cleaned.recorte.top}_bottom${cleaned.recorte.bottom}_left${cleaned.recorte.left}_right${cleaned.recorte.right}`
    );
  if (cleaned.marcaAgua)
    transformaciones.push(`marca_agua_${cleaned.marcaAgua.texto}`);

  return {
    ...cleaned,
    transformaciones: transformaciones.length ? transformaciones.join(", ") : undefined,
  };
}

// 🧱 Construcción directa de string de transformaciones (idéntico a build)
export function buildTransformacionesString(values: Partial<ValoresTransformacion>): string {
  const parts: string[] = [];

  if (values.rotacion) parts.push(`rotar_${values.rotacion}°`);
  if (values.brillo !== undefined || values.contraste !== undefined)
    parts.push(
      `ajustar_brillo_${values.brillo ?? 0}_contraste_${values.contraste ?? 0}`
    );
  if (values.saturacion) parts.push(`ajustar_saturacion_${values.saturacion}`);
  if (values.escalaGrises) parts.push("escala_grises");
  if (values.desenfoque) parts.push(`desenfoque_${values.desenfoque}`);
  if (values.nitidez) parts.push(`ajustar_nitidez_${values.nitidez}`);
  if (values.reflejarHorizontal) parts.push("reflejar_horizontal");
  if (values.reflejarVertical) parts.push("reflejar_vertical");

  if (values.redimensionar)
    parts.push(`redimensionar_${values.redimensionar.ancho}x${values.redimensionar.alto}`);

  if (values.recorte)
    parts.push(
      `recorte_${values.recorte.left}_${values.recorte.top}_${values.recorte.right}_${values.recorte.bottom}`
    );

  if (values.marcaAgua)
    parts.push(
      `insertar_texto_${values.marcaAgua.texto}_${values.marcaAgua.x}_${values.marcaAgua.y}`
    );

  return parts.join(", ");
}

// 🔁 Inglés → interfaz de edición
export function mapToEnglish(values: ValoresTransformacion): Partial<TransformValues> {
  const mapped = {
    brightness: values.brillo ?? 0,
    contrast: values.contraste ?? 0,
    saturation: values.saturacion,
    rotation: values.rotacion,
    format: values.formato,
    grayscale: values.escalaGrises,
    blur: values.desenfoque,
    sharpen: values.nitidez,
    resize: values.redimensionar
      ? { width: values.redimensionar.ancho, height: values.redimensionar.alto }
      : undefined,
    flipHorizontal: values.reflejarHorizontal,
    flipVertical: values.reflejarVertical,
    crop: values.recorte
      ? {
          top: values.recorte.top,
          bottom: values.recorte.bottom,
          left: values.recorte.left,
          right: values.recorte.right,
        }
      : undefined,
    watermark: values.marcaAgua
      ? { text: values.marcaAgua.texto, x: values.marcaAgua.x, y: values.marcaAgua.y }
      : undefined,
  };
  return cleanObject(mapped);
}
