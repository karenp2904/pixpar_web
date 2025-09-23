import TransformService from "../transformService";

/**
 * Guarda todas las transformaciones en localStorage.
 * También podrías enviarlas al backend si quieres persistencia remota.
 */
export async function saveTransformsService() {
  const transforms = TransformService.getAllTransforms();
  localStorage.setItem("pixpar_transforms", JSON.stringify(transforms));

  console.log("✅ Transformaciones guardadas en localStorage:", transforms);
  return transforms;
}

/**
 * Llama al servicio SOAP para aplicar transformaciones
 * y descarga el resultado como archivo ZIP.
 */
export async function exportTransformsService() {
  try {
    const xmlResponse = await TransformService.applyAllTransforms([]);
    console.log("📦 Exportación completada. XML de respuesta:", xmlResponse);

    // Simulación: descarga un archivo con el XML recibido
    const blob = new Blob([xmlResponse], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `pixpar-export-${Date.now()}.xml`;
    link.click();

    return xmlResponse;
  } catch (err) {
    console.error("❌ Error al exportar transformaciones:", err);
    throw err;
  }
}
