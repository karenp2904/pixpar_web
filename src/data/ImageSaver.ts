import { saveAs } from "file-saver";

export class ImageSaver {
  /**
   * Guarda una imagen individual en el formato indicado
   * @param base64 Imagen en base64
   * @param filename Nombre de archivo (sin extensión)
   * @param format Formato (JPEG, PNG...)
   */
  static saveImage(base64: string, filename: string, format: string) {
    const blob = ImageSaver.base64ToBlob(base64, format);
    saveAs(blob, `${filename}.${format.toLowerCase()}`);
  }

  private static base64ToBlob(base64: string, format: string): Blob {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: `image/${format.toLowerCase()}` });
  }
}
