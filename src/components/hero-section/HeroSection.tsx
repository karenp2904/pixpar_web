import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./HeroSection.css";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section py-16 md:py-24 overflow-hidden bg-pixpar-black text-pixpar-white">
      <div className="hero-background-blur-1" />
      <div className="hero-background-blur-2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Texto (columna izquierda) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-6 order-2 lg:order-1"
              >
                <h1 className="hero-gradient-text text-5xl lg:text-6xl">
                  PixPar
                </h1>
                <p className="hero-subtitle">
                  Procesa, edita y transforma imágenes en segundos con la potencia de la inteligencia artificial
                </p>

                <div className="hero-buttons">
                  <Link to="/editorLote" className="hero-button-primary">
                    <span>✨ Probar ahora</span>
                  </Link>
                  <Link to="/#herramientas" className="hero-button-secondary">
                    <span>🔧 Ver herramientas</span>
                  </Link>
                </div>
              </motion.div>

              {/* Imagen (columna derecha) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative order-1 lg:order-2"
              >
                <div className="hero-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&crop=center"
                    alt="Ejemplo PixPar - Edición de imágenes con IA"
                    className="hero-image"
                  />
                  <div className="hero-overlay"></div>
                  <div className="hero-filter-badge">Filtro: Neón ✨</div>
                </div>
              </motion.div>
            </div>

      </div>
    </section>
  );
};

export default HeroSection;