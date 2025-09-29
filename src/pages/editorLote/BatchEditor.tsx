import React, { useState } from "react"; 
import BatchImageSelector from "../../components/editor/extra/BatchImageSelector";
import TransformControls from "./transforms/TransformControls";
import "./BatchEditor.css";
import type { SelectedImage } from "../../components/editor/extra/BatchImageSelector";
import SelectedGallery from "../../components/editor/extra/SelectedGallery";
import transformService from "../../services/transformService";
import type TransformValues from "../../services/Interface/transform";
import { Icon } from "@iconify/react";
import {   decompressGzipBase64, imageFileToGzipBase64,  } from "../../services/tools_transform/fileBase64";
import TransformXmlStorage from "../../data/LocalStorage";
import { ImageSaver } from "../../data/ImageSaver";
import ImageExporter from "../../data/ImageExporter";
  import Notification, { type NotificationType } from "../../components/notification/Notificacion";


const BatchEditor: React.FC = () => {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [transformations, setTransformations] = useState<Record<string, TransformValues>>({});
  const [isSending, setIsSending] = useState<boolean>(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);

  const selectedImage = images[selectedImageIndex] || null;
  const [transformedImages, setTransformedImages] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);

  /** Selección inicial de imágenes */
  const handleImageSelection = (newImages: SelectedImage[]) => {
    setImages(newImages);
    setSelectedImageIndex(0);
    setTransformedImageUrl(null);

    if (newImages.length > 0) {
      const formatoReal = newImages[0].file?.type.split("/")[1]?.toUpperCase() || "JPG";

      setTransformations(prev => ({
        ...prev,
        [newImages[0].id]: {
          ...(prev[newImages[0].id] || {}),
          formato: formatoReal
        }
      }));
    }
  };




  /** Remueve imagen y sus transformaciones */
  const handleRemoveImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    setTransformations((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (selectedImage?.id === id) {
      setSelectedImageIndex(updated.length > 0 ? 0 : -1);
    }
  };

  /** Actualiza transformaciones para la imagen seleccionada */
  const handleTransformChange = (values: TransformValues) => {
    setTransformations((prev) => ({
      ...prev,
      [selectedImage?.id!]: values, // aquí se guarda el formato seleccionado
    }));
  };




  /** Aplica solo a la imagen actual */
  const handleApplyCurrent = async () => {
    if (!selectedImage || !selectedImage.file) return;

    try {
      setIsSending(true);

      const formato =
      transformations[selectedImage.id]?.format?.toUpperCase() ||
      selectedImage.file.type.split("/")[1]?.toUpperCase() ||
      "JPG";
      console.log("Respuesta formatoo:",  transformations[selectedImage.id]?.format?.toUpperCase());
      console.log("Respuesta formato:", formato);

      const imageBase64 = await transformService.applyTransformForImage(selectedImage.id, {
        base64: await imageFileToGzipBase64(selectedImage.file),
        formato,
        transform: transformations[selectedImage.id],
      });

      
      console.log("Respuesta Base64:", imageBase64);
      
      const decompressedBase64 = await decompressGzipBase64(imageBase64);



      // Mostrar en pantalla
      setTransformedImageUrl(`data:image/${formato.toLowerCase()};base64,${decompressedBase64}`);
      setTransformedImages(prev => ({
        ...prev,
        [selectedImage.id]: `data:image/${formato.toLowerCase()};base64,${decompressedBase64}`,
      }));
      // Guardar en localStorage
      TransformXmlStorage.saveToLocalStorage(transformations, imageBase64);

      console.log("✅ XML guardado en localStorage.");
    } catch (error) {
      console.error("❌ Error al aplicar transformaciones:", error);
      setServerResponse("<error>No se pudo aplicar la transformación</error>");
    } finally {
      setIsSending(false);
    }
  };


  /** Aplica todas las transformaciones y manda lista de imágenes + transformaciones */
  /** Aplica todas las transformaciones y manda lista de imágenes + transformaciones */
 const handleApplyAll = async () => {
  try {
    setIsSending(true);
    setServerResponse(null);

    // 1️⃣ Preparamos payload
    const payload = await Promise.all(
      images.filter(img => img.file).map(async img => {
        const formato = img.file!.type.split("/")[1]?.toUpperCase() || "JPEG";
        console.log("Preparando imagen:", img.id, "Formato:", formato);
        return {
          id: img.id,
          base64: await imageFileToGzipBase64(img.file!),
          formato,
          transform: transformations[img.id] ?? {},
        };
      })
    );

    // 2️⃣ Llamada al servicio
    const parser = await transformService.applyAllTransforms(payload);

    if (parser.imagenes?.length) {
      const nuevasImagenes: Record<string, string> = {};

      for (const img of parser.imagenes) {
        const decompressed = await decompressGzipBase64(img.base64);
        nuevasImagenes[img.id ?? crypto.randomUUID()] =
          `data:image/${img.formato.toLowerCase()};base64,${decompressed}`;
      }

      setTransformedImages(prev => ({
        ...prev,
        ...nuevasImagenes,
      }));

      console.log("Respuesta transformaciones en lote:", parser);

      // 3️⃣ Guardar en localStorage la transformada de la imagen seleccionada
      if (selectedImage) {
        const img = parser.imagenes.find(i => i.id === selectedImage.id);
        if (img) {
          TransformXmlStorage.saveToLocalStorage(transformations, img.base64);
          setTransformedImageUrl(
            `data:image/${img.formato.toLowerCase()};base64,${await decompressGzipBase64(img.base64)}`
          );
        }
      }

      // 4️⃣ Reiniciar transformaciones si corresponde
      setTransformations({});
    }
  } catch (error) {
    console.error("❌ Error al enviar transformaciones:", error);
    setServerResponse("<error>No se pudieron aplicar las transformaciones</error>");
  } finally {
    setIsSending(false);
  }
};







// Función helper para mostrar notificaciones
const showNotification = (message: string, type: NotificationType = "info") => {
  setNotification({ message, type });
};

const handleSave = async () => {
  if (!selectedImage) return;

  // Obtenemos base64 de la imagen mostrada
  let base64: string;
  if (transformedImageUrl) {
    base64 = transformedImageUrl.split(",")[1]; // quitar "data:image/..."
  } else if (selectedImage.file) {
    base64 = await imageFileToGzipBase64(selectedImage.file);
  } else {
    return; // nada que guardar
  }

  // Obtenemos formato seleccionado
  const format =
    transformations[selectedImage.id]?.format?.toUpperCase() ||
    selectedImage.file?.type.split("/")[1].toUpperCase() ||
    "JPG";

  ImageSaver.saveImage(base64, selectedImage.id, format);
};

const handleExport = async () => {
  try {
    if (!images.length) {
      showNotification("No hay imágenes para exportar.", "error");
      return;
    }

    const imagesToExport = await Promise.all(
      images.map(async (img) => {
        let finalBase64: string;

        if (img.id === selectedImage?.id && transformedImageUrl) {
          // La que se ve en pantalla
          finalBase64 = transformedImageUrl.split(",")[1];
        } else if (transformedImages[img.id]) {
          // Otras transformadas previamente aplicadas
          finalBase64 = transformedImages[img.id].split(",")[1];
        } else if (img.file) {
          // Original
          finalBase64 = await imageFileToGzipBase64(img.file);
        } else {
          finalBase64 = "";
        }

        const formato =
          (transformations[img.id]?.format?.toUpperCase()) ||
          "JPG";
        console.log("Exportando imagennn:", img.id, "Formato:", formato);
        return { id: img.id, base64: finalBase64, formato:formato };
      })
    );

    await ImageExporter.exportImages(imagesToExport);
    showNotification("Exportación completada correctamente.", "success");
  } catch (error) {
    console.error("Error al exportar imágenes:", error);
    showNotification("Hubo un problema al exportar las imágenes.", "error");
  }
};



  return (
    <div className="batch-editor">
      {/* === PANEL IZQUIERDO === */}
      <div className="left-panel">
        <TransformControls
          key={selectedImage?.id}
          selectedImageIndex={selectedImageIndex}
          totalImages={images.length}
          onChangeImage={(newIndex) => {
            setSelectedImageIndex(newIndex);
            setTransformedImageUrl(null);
          }}
          onTransformChange={(newTransform) => handleTransformChange(newTransform)}
          savedTransform={selectedImage ? transformations[selectedImage.id] : undefined}
        />



        <div className="actions">
          <button
            className="apply-btn"
            onClick={handleApplyCurrent}
            disabled={!selectedImage}
          >
            {isSending ? "⏳ Aplicando..." : "Aplicar a imagen actual"}
          </button>

          <button
            className="apply-btn"
            onClick={handleApplyAll}
            disabled={images.length === 0}
          >
            {isSending ? "⏳ Aplicando..." : "Aplicar a todas las imágenes"}
          </button>
        </div>


      </div>

      {/* === PANEL CENTRAL === */}
      <div className="center-panel">
         {selectedImage ? (
        <img
          src={transformedImageUrl ?? selectedImage.src}
          alt="Imagen seleccionada"
          style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "12px" }}
        />
      ) : (
        <p>No hay imagen seleccionada</p>
      )}


        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
            duration={2500}
          />
        )}
    </div>

      {/* === PANEL DERECHO === */}
      <div className="right-panel">
        <BatchImageSelector onSelect={handleImageSelection} />
        <SelectedGallery
          images={images}
          selectedImage={selectedImage}
          onSelect={(img) =>
            setSelectedImageIndex(images.findIndex((i) => i.id === img.id))
          }
          onRemove={handleRemoveImage}
        />

      <div className="action-buttons">
        <button className="navbar-button navbar-button-ghost" onClick={handleSave}>
          <Icon icon="lucide:save" className="mr-2" />
          Guardar
        </button>

        <button className="navbar-button navbar-button-primary" onClick={handleExport}>
          <Icon icon="lucide:download" className="mr-2" />
          Exportar
        </button> 
      </div>

        
    
      </div>
    </div>
  );
};

export default BatchEditor;


