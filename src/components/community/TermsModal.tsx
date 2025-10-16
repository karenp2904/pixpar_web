import React from "react";
import "./style/terms.css";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ open, onClose }) => {
  if (!open) return null; // evita render si no está abierto

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <h2>Términos y Condiciones</h2>
        <p>
          Al usar Pixpar, aceptas que tus imágenes pueden publicarse en la galería comunitaria.
          También reconoces que Pixpar puede almacenar tus creaciones de acuerdo al plan elegido.
        </p>
        <button className="pixpar-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};
