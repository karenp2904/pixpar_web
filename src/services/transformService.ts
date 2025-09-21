import type TransformValues from "./Interface/trasnforms";
import { buildTransformXML } from "./xml/xmlBuilder";
import { XMLReader } from "./xml/xmlReader";


class TransformService {
  private transforms: Record<string, TransformValues> = {};

  saveTransform(id: string, values: TransformValues) {
    this.transforms[id] = values;
    console.log(`💾 Guardado transform para [${id}]:`, values);
  }

  getTransform(id: string): TransformValues | null {
    return this.transforms[id] || null;
  }

  getAllTransforms(): Record<string, TransformValues> {
    return this.transforms;
  }

  removeTransform(id: string) {
    if (this.transforms[id]) {
      console.log(`🗑️ Eliminando transform de [${id}]`);
      delete this.transforms[id];
    }
  }

  reset() {
    console.log("♻️ Reiniciando transformaciones...");
    this.transforms = {};
  }

    async applyTransformForImage(id: string, p0: TransformValues): Promise<string> {
    const transform = this.transforms[id];
    if (!transform) throw new Error(`No hay transformaciones para la imagen ${id}`);
    console.log(`Aplicando transform para [${id}]:`, transform);

    const xml = buildTransformXML({ [id]: transform }, false);
    const response = await fetch(`/api/apply-transform/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });

    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
    const xmlText = await response.text();

    // Parsear XML para mostrar resumen en UI
    const reader = new XMLReader(xmlText);
    console.log(reader.resumen());

    return xmlText;
  }

  async applyAllTransforms(payload: { id: string; src: string; transform: TransformValues; }[]): Promise<string> {
    const xml = buildTransformXML(this.transforms, true);
    console.log(`Aplicando transform para `, this.transforms);

    const response = await fetch("/api/apply-batch-transformations", {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });

    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
    const xmlText = await response.text();

    // Parsear XML para mostrar resumen en UI
    const reader = new XMLReader(xmlText);
    console.log(reader.resumen());

    this.reset();
    return xmlText;
  }
}

export default new TransformService();