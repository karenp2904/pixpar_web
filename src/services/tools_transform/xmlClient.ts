// services/xmlClient.ts

/**
 * Convierte un nodo XML a un objeto JS de forma genérica.
 */
export function xmlToJson(xml: Document | Element): any {
  let obj: any = {};

  // Si el nodo tiene atributos, los agregamos al objeto
  if (xml.nodeType === 1 && (xml as Element).attributes.length > 0) {
    obj["@attributes"] = {};
    for (let i = 0; i < (xml as Element).attributes.length; i++) {
      const attribute = (xml as Element).attributes.item(i);
      if (attribute) obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
    }
  }

  // Procesar nodos hijos
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);

      // Si es texto (nodeType === 3)
      if (item.nodeType === 3) {
        const text = item.nodeValue?.trim();
        if (text) {
          // Si solo hay texto, devolvemos el string en vez de objeto
          if (Object.keys(obj).length === 0) return text;
          obj["#text"] = text;
        }
      } else {
        const nodeName = item.nodeName;
        const childObject = xmlToJson(item as Element);

        // Si la propiedad no existe, la creamos
        if (!(nodeName in obj)) {
          obj[nodeName] = childObject;
        } else {
          // Si ya existe, convertimos en array si no lo es
          if (!Array.isArray(obj[nodeName])) {
            obj[nodeName] = [obj[nodeName]];
          }
          obj[nodeName].push(childObject);
        }
      }
    }
  }

  return obj;
}

/**
 * Hace una petición HTTP y convierte la respuesta XML en JSON.
 * Funciona para cualquier endpoint que devuelva XML.
 */
export async function fetchXmlAsJson(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error en la petición XML (${response.status})`);

  const xmlText = await response.text();

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  // Validación de error en el XML
  const parserError = xmlDoc.querySelector("parsererror");
  if (parserError) {
    throw new Error(`Error al parsear el XML: ${parserError.textContent}`);
  }

  return xmlToJson(xmlDoc.documentElement);
}
