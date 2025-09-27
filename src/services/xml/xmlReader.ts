interface SOAPResponse {
  status: string;
  taskId: string;
  xmlResult: string;
  tiempoProceso?: number;
  nodoProcesado?: string;
  attempts?: number;
}

export function parseSoapResponse(soapText: string): SOAPResponse {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(soapText, "text/xml");

  // Namespace tns
  const tnsNS = "http://servidor.procesamiento.imagenes/soap";

  // Helper para buscar por tag name con namespace
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

  return {
    status,
    taskId,
    xmlResult,
    tiempoProceso: tiempoProceso ? parseFloat(tiempoProceso) : undefined,
    nodoProcesado: nodoProcesado || undefined,
    attempts: attempts ? parseInt(attempts) : undefined,
  };
}
