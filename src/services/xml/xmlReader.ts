interface ImagenProcesada {
  id: string; // ← importante para saber a qué imagen corresponde
  formato: string;
  transformaciones: string[];
  base64: string;
}

interface SOAPResponse {
  status: string;
  taskId: string;
  xmlResult: string; // crudo (por si lo necesitas)
  imagenes?: ImagenProcesada[]; // ✅ ya parseadas
  tiempoProceso?: number;
  nodoProcesado?: string;
  attempts?: number;
}

export function parseSoapResponse(soapText: string): SOAPResponse {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(soapText.trim(), "text/xml");

  const tnsNS = "http://servidor.procesamiento.imagenes/soap";
  function getText(tag: string): string | null {
    const elems = xmlDoc.getElementsByTagNameNS(tnsNS, tag);
    return elems.length > 0 ? elems[0].textContent : null;
  }

  const status = getText("status");
  const taskId = getText("task_id");
  const tiempoProceso = getText("tiempo_proceso");
  const nodoProcesado = getText("nodo_procesado");
  const attempts = getText("attempts");

  // 🔍 Obtener el elemento completo <tns:xml_result>
  const xmlResultElem = xmlDoc.getElementsByTagNameNS(tnsNS, "xml_result")[0];
  if (!status || !taskId || !xmlResultElem) {
    throw new Error(`SOAP inválido o incompleto: ${soapText}`);
  }

  // ✅ Extraer el XML interno como string
  const innerXml = new XMLSerializer()
    .serializeToString(xmlResultElem)
    .replace(/^<[^>]+>|<\/[^>]+>$/g, ""); // quita las etiquetas <tns:xml_result> y </tns:xml_result>

  // ✅ Parsear el contenido interno de xml_result
  const imagenes: ImagenProcesada[] = [];
  try {
    const resultDoc = parser.parseFromString(innerXml.trim(), "text/xml");
    const imagenNodes = resultDoc.getElementsByTagName("imagen");

    for (let i = 0; i < imagenNodes.length; i++) {
      const node = imagenNodes[i];
      const id = (i + 1).toString();
      const formato = node.getAttribute("formato") ?? "DESCONOCIDO";
      const transformaciones =
        node.getAttribute("transformaciones")?.split(",").map(t => t.trim()) ?? [];
      const base64 = node.textContent?.trim() ?? "";

      imagenes.push({ id, formato, transformaciones, base64 });
    }
    console.log("📸 Imágenes procesadas:", imagenes);
  } catch (err) {
    console.warn("⚠️ No se pudo parsear xml_result:", err);
  }

  return {
    status,
    taskId,
    xmlResult: innerXml,
    imagenes,
    tiempoProceso: tiempoProceso ? parseFloat(tiempoProceso) : undefined,
    nodoProcesado: nodoProcesado || undefined,
    attempts: attempts ? parseInt(attempts) : undefined,
  };
}
