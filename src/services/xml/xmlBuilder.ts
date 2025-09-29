import type TransformState from "../Interface/Transformacion";

/**
 * Construye un XML completo listo para enviar al SOAP.
 * Usa CDATA para proteger <imagenes> dentro del SOAP.
 */
export async function buildSoapTransformXML(
  transformations: Record<
    string,
    TransformState & { base64?: string; formato?: string; transformaciones?: string }
  >,
  options: {
    prioridad?: number;
    tipo_servicio?: string;
    formato_salida?: string;
    calidad?: number;
    poll_interval?: number;
    max_attempts?: number;
  } = {}
): Promise<string> {
  const {
    prioridad = 3,
    tipo_servicio = "procesamiento_batch",
    formato_salida = "JPEG",
    calidad = 85,
    poll_interval = 3.0,
    max_attempts = 30,
  } = options;

  // 1️⃣ Construcción de <imagenes>
  const doc = document.implementation.createDocument("", "", null);
  const root = doc.createElement("imagenes");

  for (const [_id, values] of Object.entries(transformations)) {
    const imagenElem = doc.createElement("imagen");

    if (values.formato) {
      imagenElem.setAttribute("formato", values.formato.toUpperCase());
    }

    if (values.transformaciones && values.transformaciones.trim() !== "") {
      imagenElem.setAttribute("transformaciones", values.transformaciones);
    }

    if (values.base64) {
      const base64Node = doc.createTextNode(values.base64);
      imagenElem.appendChild(base64Node);
    }

    root.appendChild(imagenElem);
  }

  doc.appendChild(root);
  const xmlImagenes = new XMLSerializer().serializeToString(doc);

  // 2️⃣ Construir SOAP completo
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:tns="http://servidor.procesamiento.imagenes/soap">
  <soap:Body>
    <tns:procesarImagenesAuto>
      <tns:xml_content><![CDATA[${xmlImagenes}]]></tns:xml_content>
      <tns:prioridad>${prioridad}</tns:prioridad>
      <tns:tipo_servicio>${tipo_servicio}</tns:tipo_servicio>
      <tns:formato_salida>${formato_salida}</tns:formato_salida>
      <tns:calidad>${calidad}</tns:calidad>
      <tns:poll_interval>${poll_interval}</tns:poll_interval>
      <tns:max_attempts>${max_attempts}</tns:max_attempts>
    </tns:procesarImagenesAuto>
  </soap:Body>
</soap:Envelope>`;
}
