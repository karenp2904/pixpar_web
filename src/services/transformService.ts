import type TransformValues from "./Interface/transform";
import { buildSoapTransformXML } from "./xml/xmlBuilder";
import { buildTransformacionesString, mapToEnglish, mapToSpanish } from "./tools_transform/mapInterface";
import { fetchXmlAsJson } from "./tools_transform/xmlClient";
import { parseImagenesProcesadas } from "./tools_transform/transformParser";
import { parseSoapResponse } from "./xml/xmlReader";

const SERVER_URL = "http://192.168.1.9:5001";

class TransformService {
  private transforms: Record<string, TransformValues> = {};

  saveTransform(id: string, values: TransformValues) {
    this.transforms[id] = values;
  }

  getTransform(id: string): TransformValues | null {
    return this.transforms[id] || null;
  }

  getAllTransforms() {
    return this.transforms;
  }

  reset() {
    console.log("♻️ Reiniciando transformaciones...");
    this.transforms = {};
  }


  /**
   * Aplica transformación de UNA imagen usando SOAP
   * y retorna el task_id para luego consultar resultados.
   */

  async applyTransformForImage(
    id: string,
    payload: { transform: TransformValues; base64: string; formato: string }
  ) {
    const transform = payload.transform || this.transforms[id];
    if (!transform) throw new Error(`No hay transformaciones para la imagen ${id}`);
    const spanishTransform = mapToSpanish(transform);

    const mapped = {
      ...spanishTransform,
      transformaciones: buildTransformacionesString(spanishTransform),
      base64: payload.base64,
      formato: payload.formato,
    };
    
    console.log(`Enviando transform para [${id}] (con base64):`, mapped);

    const soapXML = await buildSoapTransformXML(
      { [id]: mapped },
      {
        prioridad: 3,
        tipo_servicio: "procesamiento_batch",
        formato_salida: mapped.formato,
        calidad: mapped.nitidez ?? 85,
        poll_interval: 3.0,
        max_attempts: 30,
      }
);

    
    console.log(soapXML); 

    const response = await fetch(`${SERVER_URL}/soap`, {
      method: "POST",
      headers: {
          "Content-Type": "text/xml",
          "SOAPAction": "procesarImagenesAuto",
        },      
        body: soapXML,
    });


    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Respuesta no OK (${response.status}):`, text);
      throw new Error(`Servidor devolvió ${response.status} - ${text}`);
    }

    const responseText = await response.text(); // leer como texto
    console.log("📥 Respuesta SOAP:", responseText);

    // Si quieres, puedes parsear el XML a objeto JS
    const parser = parseSoapResponse(responseText);

    console.log(`✅ Task ID recibido: ${parser.taskId}`);
    console.log(`✅ Detalles: ${parser.xmlResult}`); //base64 transformada

    return parser;

  }


  
  

/*
  async applyTransformForImage(
    id: string,
    payload: { transform: TransformValues; base64: string; formato: string }
    ) {
      const transform = payload.transform || this.transforms[id];
      if (!transform) throw new Error(`No hay transformaciones para la imagen ${id}`);

      // Mapear transformaciones a español
      const mappedTransform = mapToSpanish(transform);

      // Optimizar Base64
      const optimizedBase64 = optimizeBase64(payload.base64);

      // Crear XML de la imagen usando tu función
      const imageXML = createImageXML(optimizedBase64, payload.formato, JSON.stringify(mappedTransform));

      console.log("XML SOAP generado:", imageXML);

      // Enviar la solicitud al servidor
      const response = await fetch(`${SERVER_URL}/soap`, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
          "SOAPAction": "procesarImagenesAuto",
        },
        body: imageXML,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`❌ Respuesta no OK (${response.status}):`, text);
        throw new Error(`Servidor devolvió ${response.status} - ${text}`);
      }

      const responseText = await response.text();
      console.log("📥 Respuesta SOAP:", responseText);

      // Parsear la respuesta SOAP
      const parser = parseSoapResponse(responseText);
      console.log(`✅ Task ID recibido: ${parser}`);

      return parser;
    }

*/

  /**
   * Aplica todas las transformaciones acumuladas
   */
  async applyAllTransforms(
    payload: { id: string; base64: string; formato: string; transform: TransformValues }[]
  ) {
    const mapped: Record<string, any> = {};
    for (const item of payload) {
      mapped[item.id] = {
        ...mapToSpanish(item.transform),
        base64: item.base64,
        formato: item.formato,
      };
    }

    const soapXML = await buildSoapTransformXML(mapped, {
      prioridad: 3,
      tipo_servicio: "procesamiento_batch",
      formato_salida: mapped.formato,
      calidad: mapped.nitidez ?? 85,
      poll_interval: 3.0,
      max_attempts: 30,
    });


    const response = await fetch(`${SERVER_URL}/soap`, {
      method: "POST",
      headers: {
          "Content-Type": "text/xml",
          "SOAPAction": "procesarImagenesAuto",
        },      
        body: soapXML,
    });

    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

    const responseText = await response.text();
  console.log("📥 Respuesta SOAP completa:", responseText.slice(0, 500)); // solo muestra los primeros 500 chars

  try {
    // Parsear el XML SOAP
    const parser = parseSoapResponse(responseText);

    // Verificar que la respuesta sea válida
    if (!parser || !parser.status) {
      console.error("❌ Respuesta SOAP inválida o incompleta:", parser);
      throw new Error("No se pudo procesar la respuesta SOAP.");
    }

    // Loguear los resultados
    console.log(`✅ Estado: ${parser.status}`);
    console.log(`🆔 Task ID: ${parser.taskId}`);
    console.log(`🕒 Tiempo de proceso: ${parser.tiempoProceso ?? "N/A"} seg`);
    console.log(`💻 Nodo: ${parser.nodoProcesado ?? "Desconocido"}`);

    if (parser.imagenes && parser.imagenes.length > 0) {
      console.log("Imágenes procesadas:");
      parser.imagenes.forEach((img, i) => {
        console.log(`  [${i}] Formato: ${img.formato}, Transformaciones: ${img.transformaciones.join(", ")}`);
      });
    } else {
      console.warn("⚠️ No se encontraron imágenes procesadas en la respuesta SOAP.");
    }

    return parser;

  } catch (error) {
    console.error("❌ Error al procesar la respuesta SOAP:", error);
    return {
      status: "error",
      taskId: "unknown",
      xmlResult: responseText,
      imagenes: [],
    };
  }
  }

  /**
   * Consulta el estado de un task_id y devuelve JSON crudo
   */
  async consultarResultado(taskId: string) {
    const response = await fetch(`${SERVER_URL}/obtener_resultado/${taskId}`);
    if (!response.ok) throw new Error(`Error consultando resultado: ${response.status}`);
    return await response.text(); // XML crudo
  }

  /**
   * Consulta el resultado y lo convierte en objeto JS procesado
   */
  async getTransformResult(taskId: string) {
    return this.waitForTransformResult(taskId); //  Usa el polling automático
  }

  async obtenerEstadisticas() {
    const response = await fetch(`${SERVER_URL}/estadisticas`);
    if (!response.ok) throw new Error(`Error obteniendo estadísticas`);
    return await response.json();
  }

  /**
   * Consulta repetidamente el estado de un task_id hasta obtener un resultado.
   * @param taskId - ID de la tarea
   * @param intervaloMs - Tiempo entre consultas (ms)
   * @param maxIntentos - Máximo número de intentos
   */
  async waitForTransformResult(
    taskId: string,
    intervaloMs: number = 3000,
    maxIntentos: number = 50
  ): Promise<ReturnType<typeof parseImagenesProcesadas>> {
    let intentos = 0;

    while (intentos < maxIntentos) {
      const response = await fetch(`${SERVER_URL}/obtener_resultado/${taskId}`);
      if (!response.ok) {
        throw new Error(`Error consultando resultado: ${response.status}`);
      }

      const json = await response.json();
      console.log(`📡 [Polling ${intentos + 1}] Estado de la tarea:`, json.status);

      // Si la tarea ya está completada y tiene resultado
      if (json.status === "completado" && json.resultado) {
        console.log("✅ Transformación completada, parseando XML...");
        const xmlUrl = "data:text/xml," + encodeURIComponent(json.resultado);
        const parsedJson = await fetchXmlAsJson(xmlUrl);
        return parseImagenesProcesadas(parsedJson);
      }

      if (json.status === "error") {
        throw new Error(`❌ Error en tarea: ${json.error}`);
      }

      if (json.status === "not_found") {
        throw new Error(`⚠️ Tarea ${taskId} no encontrada`);
      }

      // Si no está completado, esperamos y seguimos intentando
      await new Promise((resolve) => setTimeout(resolve, intervaloMs));
      intentos++;
    }

    throw new Error(`⏱ Tiempo de espera agotado para la tarea ${taskId}`);
  }
}


export default new TransformService();
