import React, { useState } from "react";
import { HistoryPanel } from "../../components/community/HistoryPanel";
import { CommunityGallery } from "../../components/community/CommunityGallery";
import { SubscriptionModal } from "../../components/pricing-section/SubscriptionModal";
import { TermsModal } from "../../components/community/TermsModal";
import "./resourcesStyle.css";

const PixparResources: React.FC = () => {
  const [showSub, setShowSub] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="resources-section">
      {/* Galería comunidad */}
      <div className="community-gallery-section">
        <h2 className="resources-title">Imágenes de la comunidad</h2>
        <div className="pixpar-card">
          <CommunityGallery />
        </div>
       
      </div>

      {/* Historial y términos */}
      <div className="community-side-section">
        <h2 className="resources-title">Historial de creaciones</h2>
        <div className="pixpar-card">
          <HistoryPanel />
        </div>
        <button 
          onClick={() => setShowTerms(true)} 
          className="pixpar-btn-secondary"
        >
          Ver términos
        </button>
      </div>

      {/* Modal de suscripción */}
      {showSub && (
        <SubscriptionModal 
          onClose={() => setShowSub(false)} open={false}        />
      )}

      {/* Modal de términos */}
      {showTerms && (
        <TermsModal 
          open={showTerms} 
          onClose={() => setShowTerms(false)} 
        />
      )}

    </div>
  );
};

export default PixparResources;
