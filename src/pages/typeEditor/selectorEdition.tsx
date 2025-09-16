import React from "react";
import { motion } from "framer-motion";
import { Image, Layers, Copy } from "lucide-react";
import { Link } from "react-router-dom";

import "./selectorEdition.css";

export const SelectorTypeEdition: React.FC = () => {
  return (
    <div className="selector-container">
      <motion.div className="selector-card">
        <header className="selector-header">
          <h2>Elige tu tipo de edición</h2>
          <p>Selecciona si quieres editar una sola imagen o varias imágenes de forma masiva.</p>
        </header>

        <section className="selector-grid">
          <article className="selector-option">
            <div className="flex items-center gap-3">
              <div className="selector-option-icon">
                <Image className="h-6 w-6" />
              </div>
              <div>
                <h4 className="selector-option-title">Una imagen</h4>
                <p className="selector-option-text">
                  Edita una sola imagen con ajustes individuales, filtros y retoques.
                </p>
              </div>
            </div>

            <Link to="/editor" className="selector-button">
              Seleccionar
            </Link>
          </article>

          <article className="selector-option">
            <div className="flex items-center gap-3">
              <div className="selector-option-icon">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h4 className="selector-option-title">Varias imágenes</h4>
                <p className="selector-option-text">
                  Selecciona múltiples imágenes, edítalas individualmente o aplica la misma configuración a todas.
                </p>
              </div>
            </div>

            <Link to="/editorLote" className="selector-button">
              Seleccionar
            </Link>
          </article>
        </section>
      </motion.div>
    </div>
  );
};
