import JSZip from "jszip";
import { saveAs } from "file-saver";
import { decompressGzipBase64 } from "../services/tools_transform/fileBase64";

interface ImageToExport {
  id: string;
  base64: string; // GZIP Base64 desde tu servicio
  formato: string;
}

export default class ImageExporter {
    static async exportImages(images: ImageToExport[]) {
    const zip = new JSZip();

    for (const img of images) {
        let base64Data: string;

        try {
        // Intentar descomprimir
        base64Data = await decompressGzipBase64(img.base64);
        } catch (err) {
        // Si falla, asumimos que ya está descomprimido
        base64Data = img.base64;
        }

        const blob = this.base64ToBlob(base64Data, img.formato);

        if (images.length === 1) {
        saveAs(blob, `image.${img.formato.toLowerCase()}`);
        console.log("Imagen exportada:", `image.${img.formato.toLowerCase()}`);
        } else {
        zip.file(`image-${img.id}.${img.formato.toLowerCase()}`, blob);
        }
    }

    if (images.length > 1) {
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "images.zip");
    }
    }


  private static base64ToBlob(base64: string, formato: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: `image/${formato.toLowerCase()}` });
  }
}
