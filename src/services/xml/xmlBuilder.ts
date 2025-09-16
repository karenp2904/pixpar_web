export interface TransformState {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  format: string;
}

export function buildTransformXML(
  transformations: Record<string, TransformState>,
  isBatch: boolean = false
): string {
  const doc = document.implementation.createDocument("", "", null);

  const root = doc.createElement(isBatch ? "lote" : "imagen_transformacion");
  root.setAttribute("fecha_envio", new Date().toISOString());
  root.setAttribute("modo", isBatch ? "lote" : "individual");

  for (const [imageId, values] of Object.entries(transformations)) {
    const imagenElem = doc.createElement("imagen");
    imagenElem.setAttribute("id", imageId);

    for (const [key, val] of Object.entries(values)) {
      const child = doc.createElement(key);
      child.textContent = String(val);
      imagenElem.appendChild(child);
    }

    root.appendChild(imagenElem);
  }

  doc.appendChild(root);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}
