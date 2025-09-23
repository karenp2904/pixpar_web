import type TransformValues from "./Interface/trasnforms";
import { buildTransformXML } from "./xml/xmlBuilder";
import { XMLReader } from "./xml/xmlReader";

class TransformService {
  private transforms: Record<string, TransformValues> = {};

  saveTransform(id: string, values: TransformValues) {
    this.transforms[id] = values;
    console.log(` Guardado transform para [${id}]:`, values);
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

  /**
   * Crea un envelope SOAP para el payload dado.
   */
  private buildSOAPEnvelope(bodyXML: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:tr="http://upb-company.com/transform">
        <soapenv:Header/>
        <soapenv:Body>
          ${bodyXML}
        </soapenv:Body>
      </soapenv:Envelope>`;
  }

  async applyTransformForImage(id: string, p0: TransformValues): Promise<string> {
    const transform = this.transforms[id];
    if (!transform) throw new Error(`No hay transformaciones para la imagen ${id}`);
    console.log(`📤 Enviando transform para [${id}] en SOAP:`, transform);

    const bodyXML = buildTransformXML({ [id]: transform }, false);
    const soapEnvelope = this.buildSOAPEnvelope(bodyXML);

    const response = await fetch(`/api/soap/apply-transform`, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "applyTransform", // opcional, depende de tu WSDL
      },
      body: soapEnvelope,
    });

    if (!response.ok) throw new Error(`Error del servidor SOAP: ${response.status}`);

    const xmlText = await response.text();

    // Procesa la respuesta SOAP
    const cleanXML = this.extractSOAPBody(xmlText);
    const reader = new XMLReader(cleanXML);
    console.log(reader.resumen());

    return cleanXML;
  }

  async applyAllTransforms(payload: { id: string; src: string; transform: TransformValues }[]): Promise<string> {
    const bodyXML = buildTransformXML(this.transforms, true);
    const soapEnvelope = this.buildSOAPEnvelope(bodyXML);

    console.log(`📤 Enviando batch de transforms en SOAP:`, this.transforms);

    const response = await fetch("/api/soap/apply-batch-transformations", {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "applyBatchTransform", // opcional, depende de tu WSDL
      },
      body: soapEnvelope,
    });

    if (!response.ok) throw new Error(`Error del servidor SOAP: ${response.status}`);

    const xmlText = await response.text();

    // Procesa la respuesta SOAP
    const cleanXML = this.extractSOAPBody(xmlText);
    const reader = new XMLReader(cleanXML);
    console.log(reader.resumen());

    this.reset();
    return cleanXML;
  }

  /**
   * Extrae el contenido real del Body en la respuesta SOAP.
   */
  private extractSOAPBody(responseXML: string): string {
    const match = responseXML.match(/<soapenv:Body[^>]*>([\s\S]*?)<\/soapenv:Body>/);
    return match ? match[1] : responseXML;
  }
}

export default new TransformService();
