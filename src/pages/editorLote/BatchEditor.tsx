import React, { useState } from "react"; 
import BatchImageSelector from "../../components/editor/extra/BatchImageSelector";
import SelectedImageForBatch from "../../components/editor/extra/SelectedImageForBatch";
import TransformControls from "./transforms/TransformControls";
import "./BatchEditor.css";
import type { SelectedImage } from "../../components/editor/extra/BatchImageSelector";
import SelectedGallery from "../../components/editor/extra/SelectedGallery";
import transformService from "../../services/transformService";
import type TransformValues from "../../services/Interface/transform";
import { saveTransformsService, exportTransformsService } from "../../services/buttons/editorActions";
import { Icon } from "@iconify/react";
import {   imageFileToGzipBase64,  } from "../../services/tools_transform/fileBase64";


const BatchEditor: React.FC = () => {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [transformations, setTransformations] = useState<Record<string, TransformValues>>({});
  const [isSending, setIsSending] = useState<boolean>(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);

  const selectedImage = images[selectedImageIndex] || null;
  

  /** Selección inicial de imágenes */
  const handleImageSelection = (newImages: SelectedImage[]) => {
    setImages(newImages);
    setSelectedImageIndex(0);
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
  const handleTransformChange = (newTransform: TransformValues) => {
    if (!selectedImage) return;
    transformService.saveTransform(selectedImage.id, newTransform);

    setTransformations((prev) => ({
      ...prev,
      [selectedImage.id]: newTransform,
    }));
  };

  /** Aplica solo a la imagen actual */
  const handleApplyCurrent = async () => {
    if (!selectedImage || !selectedImage.file) return;

    try {
      setIsSending(true);
      setServerResponse(null);
      
  
    // Extraer el formato (ej: JPEG, PNG)
    const formato = selectedImage.file.type.split("/")[1]?.toUpperCase() || "JPEG";

    // Llamada al servicio con la imagen optimizada
    const xmlText = await transformService.applyTransformForImage(selectedImage.id, {
      base64: await imageFileToGzipBase64(selectedImage?.file), // ya optimizada
      formato,
      transform: transformations[selectedImage.id],
    });

    } catch (error) {
      console.error("❌ Error al aplicar transformaciones:", error);
      setServerResponse("<error>No se pudo aplicar la transformación</error>");
    } finally {
      setIsSending(false);
    }
  };

  /** Aplica todas las transformaciones y manda lista de imágenes + transformaciones */
  const handleApplyAll = async () => {
    try {
      setIsSending(true);
      setServerResponse(null);

      // Convertimos cada imagen a base64 optimizada y extraemos el formato
      const payload = await Promise.all(
        images
          .filter((img) => img.file)
          .map(async (img) => {
         
            const formato = img.file!.type.split("/")[1]?.toUpperCase() || "JPEG";

            return {
              id: img.id,
              base64: await imageFileToGzipBase64(selectedImage.file),
              formato,
              transform: transformations[img.id] ?? {},
            };
          })
      );

      // Enviar todas las imágenes al servicio
      const xmlText = await transformService.applyAllTransforms(payload);
     

      // Limpiar transformaciones locales
      setTransformations({});
    } catch (error) {
      console.error("❌ Error al enviar transformaciones:", error);
      setServerResponse("<error>No se pudieron aplicar las transformaciones</error>");
    } finally {
      setIsSending(false);
    }
  };




   const handleSave = async () => {
    await saveTransformsService();
    alert("✅ Transformaciones guardadas correctamente.");
  };

  const handleExport = async () => {
    try {
      await exportTransformsService();
      alert("📤 Exportación completada.");
    } catch {
      alert("❌ Hubo un problema al exportar.");
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
          onChangeImage={(newIndex) => setSelectedImageIndex(newIndex)}
          onTransformChange={handleTransformChange}
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
        <SelectedImageForBatch image={selectedImage} />
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


