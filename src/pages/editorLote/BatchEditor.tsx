import React, { useState } from "react"; 
import BatchImageSelector from "../../components/editor/extra/BatchImageSelector";
import SelectedImageForBatch from "../../components/editor/extra/SelectedImageForBatch";
import TransformControls from "./transforms/TransformControls";
import "./BatchEditor.css";
import type { SelectedImage } from "../../components/editor/extra/BatchImageSelector";
import SelectedGallery from "../../components/editor/extra/SelectedGallery";
import transformService from "../../services/transformService";
import type { TransformState } from "../../services/xml/xmlBuilder";
import type TransformValues from "../../services/Interface/trasnforms";



const BatchEditor: React.FC = () => {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [transformations, setTransformations] = useState<Record<string, TransformState>>({});

  const selectedImage = images[selectedImageIndex] || null;

  const [isSending, setIsSending] = useState<boolean>(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);

  const handleImageSelection = (newImages: SelectedImage[]) => {
    setImages(newImages);
    setSelectedImageIndex(0);
  };

  const handleRemoveImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    setTransformations((prev) => {
      const copy = { ...prev };
      delete copy[id]; // elimina transformaciones de la imagen removida
      return copy;
    });
    if (selectedImage?.id === id) {
      setSelectedImageIndex(updated.length > 0 ? 0 : -1);
    }
  };

  const handleTransformChange = (newTransform: TransformState) => {
    if (!selectedImage) return;

    // Map TransformState to TransformValues, ensuring all required properties are present
    const transformValues: TransformValues = {
      grayscale: (newTransform as any).grayscale ?? false,
      flipH: (newTransform as any).flipH ?? false,
      flipV: (newTransform as any).flipV ?? false,
      blur: (newTransform as any).blur ?? 0,
      sharpen: (newTransform as any).sharpen ?? 0,
      ...newTransform
    };

    transformService.saveTransform(selectedImage.id, transformValues); // Guarda en el service

    setTransformations((prev) => ({
      ...prev,
      [selectedImage.id]: newTransform,
    }));
  };

  const handleApplyCurrent = async () => {
    if (!selectedImage) return;
    try {
      setIsSending(true);
      setServerResponse(null);

      const xmlText = await transformService.applyTransformForImage(selectedImage.id);
      setServerResponse(xmlText);
    } catch (error) {
      console.error("❌ Error al aplicar transformaciones:", error);
      setServerResponse("<error>No se pudo aplicar la transformación</error>");
    } finally {
      setIsSending(false);
    }
  };

  const handleApplyAll = async () => {
    try {
      setIsSending(true);
      setServerResponse(null);

      const xmlText = await transformService.applyAllTransforms();
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
      {/* === CONTROLES (Izquierda) === */}
      <div className="left-panel">
        <TransformControls
          key={selectedImage?.id}
          selectedImageIndex={selectedImageIndex}
          totalImages={images.length}
          onChangeImage={(newIndex) => setSelectedImageIndex(newIndex)}
          onTransformChange={handleTransformChange}
          savedTransform={
            selectedImage
              ? (transformations[selectedImage.id] as TransformValues | undefined)
              : undefined
          }
        />

        {images.length > 0 && (
          <div className="actions">
            <button
              className="apply-btn"
              onClick={handleApplyCurrent}
              disabled={isSending || !selectedImage}
            >
              {isSending ? "⏳ Aplicando..." : " Aplicar a imagen actual"}
            </button>

            <button
              className="apply-btn"
              onClick={handleApplyAll}
              disabled={isSending}
            >
              {isSending ? "⏳ Aplicando..." : " Aplicar a todas las imágenes"}
            </button>
          </div>
        )}


        {/* === RESPUESTA DEL SERVIDOR === */}
        {serverResponse && (
          <pre className="server-response">
            {serverResponse}
          </pre>
        )}
      </div>

      {/* === IMAGEN CENTRAL === */}
      <div className="center-panel">
        <SelectedImageForBatch image={selectedImage} />
      </div>

      {/* === GALERÍA DERECHA === */}
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