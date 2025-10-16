import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import "./SubscriptionModal.css";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Básico",
    description: "Perfecto para uso personal y proyectos pequeños",
    price: 0,
    period: "Gratis",
    durationDays: 2,
    features: [
      { text: "Hasta 10 imágenes por mes", available: true },
      { text: "Filtros básicos", available: true },
      { text: "Resolución hasta 1080p", available: true },
      { text: "Soporte por email", available: true },
      { text: "Filtros avanzados con IA", available: false },
      { text: "Procesamiento en lote", available: false },
    ],
    buttonText: "Comenzar gratis",
    buttonStyle: "secondary",
    popular: false,
  },
  {
    name: "Pro",
    description: "Ideal para profesionales y equipos creativos",
    price: 19,
    period: "/mes",
    durationDays: 30,
    features: [
      { text: "Imágenes ilimitadas", available: true },
      { text: "Todos los filtros y efectos", available: true },
      { text: "Resolución hasta 4K", available: true },
      { text: "Procesamiento en lote", available: true },
      { text: "API de integración", available: true },
      { text: "Soporte prioritario", available: true },
    ],
    buttonText: "Empezar prueba gratuita",
    buttonStyle: "featured",
    popular: true,
  },
  {
    name: "Empresas",
    description: "Solución completa para grandes organizaciones",
    price: 99,
    period: "/mes",
    durationDays: 90,
    features: [
      { text: "Todo lo incluido en Pro", available: true },
      { text: "Usuarios ilimitados", available: true },
      { text: "Almacenamiento en la nube", available: true },
      { text: "Gestión de equipos", available: true },
      { text: "Soporte 24/7 dedicado", available: true },
      { text: "SLA garantizado", available: true },
    ],
    buttonText: "Contactar ventas",
    buttonStyle: "primary",
    popular: false,
  },
];

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="subscription-overlay" onClick={onClose}>
      <motion.div
        className="subscription-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-header">
          <h2>Planes de Suscripción</h2>
          <button onClick={onClose} className="close-btn">
            <Icon icon="lucide:x" />
          </button>
        </div>

        <p className="modal-subtitle">
          Elige el plan que mejor se adapte a tu flujo de trabajo.
        </p>

        <div className="modal-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`modal-card ${plan.popular ? "featured" : ""}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="plan-header">
                <h3>{plan.name}</h3>
                {plan.popular && <span className="badge">Más popular</span>}
              </div>
              <p className="plan-desc">{plan.description}</p>

              <div className="plan-price">
                <span className="currency">$</span>
                <span className="amount">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>

              <p className="plan-duration">
                Duración: <strong>{plan.durationDays}</strong> días
              </p>

              <ul className="features-list">
                {plan.features.map((feature, fIndex) => (
                  <li
                    key={fIndex}
                    className={`feature-item ${
                      !feature.available ? "disabled" : ""
                    }`}
                  >
                    <Icon
                      icon={
                        feature.available ? "lucide:check" : "lucide:x"
                      }
                      className="feature-icon"
                    />
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                className={`plan-button ${plan.buttonStyle}`}
                onClick={() => console.log(`Seleccionado: ${plan.name}`)}
              >
                {plan.buttonText}
                <Icon icon="lucide:arrow-right" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
