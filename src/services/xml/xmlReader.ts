export interface ImageInfo {
  id?: string;
  formato?: string;
  transformaciones?: string;
  total_transformaciones?: number;
  fecha_generacion?: string;
  tamaño_original?: string;
  tamaño_final?: string;
  datos_b64?: string | null;
}

export class XMLReader {
  private xmlContent: string;
  private parser: DOMParser;
  private xmlDoc: Document;

  constructor(xmlContent: string) {
    this.xmlContent = xmlContent;
    this.parser = new DOMParser();
    const parsed = this.parser.parseFromString(xmlContent, "application/xml");

    // Validar si hubo error de parseo
    const parseError = parsed.querySelector("parsererror");
    if (parseError) {
      throw new Error(`Error al parsear XML: ${parseError.textContent}`);
    }

    this.xmlDoc = parsed;
  }

  getImagesInfo(): ImageInfo[] {
    const imagenes: ImageInfo[] = [];
    const nodes = this.xmlDoc.getElementsByTagName("imagen");

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      imagenes.push({
        id: node.getAttribute("id") || undefined,
        formato: node.getAttribute("formato") || undefined,
        transformaciones: node.getAttribute("transformaciones") || undefined,
        total_transformaciones: node.getAttribute("total_transformaciones")
          ? parseInt(node.getAttribute("total_transformaciones")!)
          : undefined,
        fecha_generacion: node.getAttribute("fecha_generacion") || undefined,
        tamaño_original: node.getAttribute("tamaño_original") || undefined,
        tamaño_final: node.getAttribute("tamaño_final") || undefined,
        datos_b64: node.textContent || null,
      });
    }

    return imagenes;
  }

  resumen(): string {
    const info = this.getImagesInfo();
    let resumen = `📊 Total de imágenes procesadas: ${info.length}\n`;
    info.forEach((img, i) => {
      resumen += `🖼️ Imagen ${i + 1} (${img.formato ?? "?"}): ${
        img.total_transformaciones ?? 0
      } transformaciones → ${img.transformaciones ?? "Ninguna"}\n`;
    });
    return resumen;
  }
}
