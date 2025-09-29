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
  const xmlDoc = parser.parseFromString(soapText, "text/xml");

  const tnsNS = "http://servidor.procesamiento.imagenes/soap";
  function getText(tag: string): string | null {
    const elems = xmlDoc.getElementsByTagNameNS(tnsNS, tag);
    return elems.length > 0 ? elems[0].textContent : null;
  }

  const status = getText("status");
  const taskId = getText("task_id");
  const xmlResult = getText("xml_result");
  const tiempoProceso = getText("tiempo_proceso");
  const nodoProcesado = getText("nodo_procesado");
  const attempts = getText("attempts");

  if (!status || !taskId || !xmlResult) {
    throw new Error(`SOAP inválido o incompleto: ${soapText}`);
  }

  // ✅ Parsear el xmlResult para extraer las imágenes
  const imagenes: ImagenProcesada[] = [];
  try {
    const resultDoc = parser.parseFromString(xmlResult, "text/xml");
    const imagenNodes = resultDoc.getElementsByTagName("imagen");

    for (let i = 0; i < imagenNodes.length; i++) {
      const id = (i + 1).toString(); // Asumimos IDs secuenciales si no hay atributo
      const node = imagenNodes[i];
      const formato = node.getAttribute("formato") ?? "DESCONOCIDO";
      const transformaciones =
        node.getAttribute("transformaciones")?.split(",").map(t => t.trim()) ?? [];
      const base64 = node.textContent?.trim() ?? "";

      imagenes.push({ id, formato, transformaciones, base64 });
    }
  } catch (err) {
    console.warn("No se pudo parsear xmlResult:", err);
  }

  return {
    status,
    taskId,
    xmlResult,
    imagenes,
    tiempoProceso: tiempoProceso ? parseFloat(tiempoProceso) : undefined,
    nodoProcesado: nodoProcesado || undefined,
    attempts: attempts ? parseInt(attempts) : undefined,
  };
}
