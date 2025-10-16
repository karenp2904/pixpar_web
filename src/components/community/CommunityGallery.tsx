import React, { useEffect, useState } from "react";
import type { ImageItem } from "./HistoryPanel";
import "./style/community.css";

export const CommunityGallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("pixpar_community");
    if (raw) setImages(JSON.parse(raw));
  }, []);

  return (
    <div className="community-gallery">
      <div className="community-header">
        <h2>Galería de la comunidad</h2>
        <small>Creaciones compartidas por usuarios de Pixpar</small>
      </div>

      <div className="community-grid">
        {images.length > 0 ? (
          images.map((img) => (
            <figure key={img.id} className="community-card">
              <img src={img.url} alt={img.title} />
              <figcaption>
                <div className="title">{img.title}</div>
                <div className="date">
                  {new Date(img.createdAt).toLocaleDateString()}
                </div>
              </figcaption>
            </figure>
          ))
        ) : (
          <p>No hay imágenes publicadas todavía.</p>
        )}
      </div>

    </div>
  );
};
