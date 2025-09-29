// src/services/tools_transform/TransformXmlStorage.ts
export default class TransformXmlStorage {
  /**
   * Genera un XML y lo guarda en localStorage
   * @param transformations - Objeto con las transformaciones aplicadas por imagen
   * @param imageBase64 - Imagen resultante en base64
   * @param storageKey - Clave donde se almacenará en localStorage
   */
  static saveToLocalStorage(
    transformations: Record<string, Record<string, any>>,
    imageBase64: string,
    storageKey = "transform_result"
  ) {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<result>
  <transforms>
${Object.entries(transformations)
  .map(
    ([id, transform]) =>
      `    <image id="${id}">
${Object.entries(transform)
  .map(([key, value]) => `      <${key}>${value}</${key}>`)
  .join("\n")}
    </image>`
  )
  .join("\n")}
  </transforms>
  <imageResult>${imageBase64}</imageResult>
</result>`;

    localStorage.setItem(storageKey, xmlContent);
  }

  /**
   * Recupera el XML almacenado en localStorage
   * @param storageKey - Clave donde está almacenado
   * @returns El XML o null si no existe
   */
  static getFromLocalStorage(storageKey = "transform_result"): string | null {
    return localStorage.getItem(storageKey);
  }

  /**
   * Elimina el XML de localStorage
   * @param storageKey - Clave donde está almacenado
   */
  static clear(storageKey = "transform_result") {
    localStorage.removeItem(storageKey);
  }
}
