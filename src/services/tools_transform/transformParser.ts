// services/transformParser.ts
import pako from "pako";

/**
 * Convierte un string Base64 a Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Recibe el objeto JSON generado por xmlToJson y devuelve
 * un resultado parseado y listo para usar.
 */
export function parseImagenesProcesadas(json: any): {
  totalProcesadas: number;
  totalErrores: number;
  imagenes: {
    formato: string;
    calidad: number;
    transformaciones: string[];
    fechaGeneracion: string;
    sizeOriginal: string;
    sizeFinal: string;
    indiceProcesado: number;
    blob: Blob;
    url: string;
  }[];
} {
  const attrs = json["@attributes"];
  const imagenes = Array.isArray(json.imagen) ? json.imagen : [json.imagen];

  const result = imagenes.map((img: any) => {
    const meta = img["@attributes"];
    const compressedBase64 = img["#text"];

    // 1. Decodificar Base64 → Uint8Array
    const compressedBytes = base64ToUint8Array(compressedBase64);

    // 2. Descomprimir con pako
    const decompressed = pako.ungzip(compressedBytes);

    // 3. Crear un blob para mostrar
    const blob = new Blob([decompressed], { type: `image/${meta.formato.toLowerCase()}` });

    return {
      formato: meta.formato,
      calidad: Number(meta.calidad),
      transformaciones: meta.transformaciones.split(",").map((t: string) => t.trim()),
      fechaGeneracion: meta.fecha_generacion,
      sizeOriginal: meta["tamaño_original"],
      sizeFinal: meta["tamaño_final"],
      indiceProcesado: Number(meta.indice_procesado),
      blob,
      url: URL.createObjectURL(blob)
    };
  });

  return {
    totalProcesadas: Number(attrs.total_procesadas),
    totalErrores: Number(attrs.total_errores),
    imagenes: result,
  };
}
