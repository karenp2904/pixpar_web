import pako from "pako";

/**
 * Convierte un File de imagen a Base64 optimizado y comprimido con GZIP
 */
export async function imageFileToGzipBase64(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
    // 1️⃣ Cargar la imagen en un objeto Image
    const dataURL = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (!reader.result) return reject(new Error("FileReader result is null"));
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataURL;
    });

    // 2️⃣ Reducir tamaño si es necesario
    const scale = Math.min(1, maxWidth / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot get canvas context");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // 3️⃣ Convertir a JPEG Base64 con calidad reducida
    const resizedBase64 = canvas.toDataURL("image/jpeg", quality).split(",")[1];

    // 4️⃣ Convertir Base64 a bytes y comprimir con GZIP
    const bytes = Uint8Array.from(atob(resizedBase64), c => c.charCodeAt(0));
    const compressed = pako.gzip(bytes);

    // 5️⃣ Convertir bytes comprimidos a Base64 para enviar al servidor
    let binary = "";
    for (let i = 0; i < compressed.length; i++) binary += String.fromCharCode(compressed[i]);
    return btoa(binary);
}

//para el cliente
export async function decompressGzipBase64(base64String: string): Promise<string> {
  // 1️⃣ Decodificar base64 → bytes comprimidos
  const binaryString = atob(base64String);
  const binaryLength = binaryString.length;
  const compressedBytes = new Uint8Array(binaryLength);
  for (let i = 0; i < binaryLength; i++) {
    compressedBytes[i] = binaryString.charCodeAt(i);
  }

  // 2️⃣ Descomprimir usando pako
  const decompressedBytes = pako.ungzip(compressedBytes);

  // 3️⃣ Convertir bytes de nuevo a Base64
  let binary = "";
  for (let i = 0; i < decompressedBytes.length; i++) {
    binary += String.fromCharCode(decompressedBytes[i]);
  }

  return btoa(binary); // 👈 ESTA es tu imagen lista para usar en <img>
}

