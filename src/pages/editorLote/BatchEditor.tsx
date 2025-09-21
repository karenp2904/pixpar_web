import React, { useState } from "react"; 
import BatchImageSelector from "../../components/editor/extra/BatchImageSelector";
import SelectedImageForBatch from "../../components/editor/extra/SelectedImageForBatch";
import TransformControls from "./transforms/TransformControls";
import "./BatchEditor.css";
import type { SelectedImage } from "../../components/editor/extra/BatchImageSelector";
import SelectedGallery from "../../components/editor/extra/SelectedGallery";
import transformService from "../../services/transformService";
import type TransformValues from "../../services/Interface/trasnforms";

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
    if (!selectedImage) return;
    try {
      setIsSending(true);
      setServerResponse(null);

      const xmlText = await transformService.applyTransformForImage(
        selectedImage.id,
        transformations[selectedImage.id] // pasar transformaciones actuales
      );
      setServerResponse(xmlText);
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

      // ✅ Genera lista de imágenes con sus transformaciones
      const payload = images.map((img) => ({
        id: img.id,
        src: img.src,
        transform: transformations[img.id] || null,
      }));

      const xmlText = await transformService.applyAllTransforms(payload);
      setServerResponse(xmlText);
      setTransformations({});
    } catch (error) {
      console.error("❌ Error al enviar transformaciones:", error);
      setServerResponse("<error>No se pudieron aplicar las transformaciones</error>");
    } finally {
      setIsSending(false);
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

        {images.length > 0 && (
          <div className="actions">
            <button
              className="apply-btn"
              onClick={handleApplyCurrent}
              disabled={isSending || !selectedImage}
            >
              {isSending ? "⏳ Aplicando..." : "Aplicar a imagen actual"}
            </button>

            <button
              className="apply-btn"
              onClick={handleApplyAll}
              disabled={isSending}
            >
              {isSending ? "⏳ Aplicando..." : "Aplicar a todas las imágenes"}
            </button>
          </div>
        )}

        {/* === RESPUESTA DEL SERVIDOR === */}
        {serverResponse && (
          <pre className="server-response">{serverResponse}</pre>
        )}
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
      </div>
    </div>
  );
};

export default BatchEditor;
