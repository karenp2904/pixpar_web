import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import "./PricingSection.css";

const plans = [
  {
    name: "Gratis",
    description: "Ideal para explorar Pixpar con funciones básicas.",
    price: 0,
    period: "Gratis",
    duration: "2 días de historial guardado",
    color: "blue",
    features: [
      { text: "Hasta 10 imágenes por mes", available: true },
      { text: "Resolución 1080p", available: true },
      { text: "Filtros básicos", available: true },
      { text: "Historial se elimina cada 2 días", available: true },
      { text: "Sin funciones avanzadas", available: false },
      { text: "Sin almacenamiento extendido", available: false },
    ],
    buttonText: "Usar plan gratis",
    buttonStyle: "secondary",
  },
  {
    name: "Pro",
    description: "Perfecto para creadores frecuentes y diseñadores.",
    price: 19,
    period: "/mes",
    duration: "30 días de historial guardado",
    color: "green",
    features: [
      { text: "Imágenes ilimitadas", available: true },
      { text: "Filtros avanzados con IA", available: true },
      { text: "Resolución hasta 4K", available: true },
      { text: "Historial permanente", available: true },
      { text: "Exportación rápida", available: true },
      { text: "Soporte prioritario", available: true },
    ],
    buttonText: "Elegir plan Pro",
    buttonStyle: "featured",
  },
  {
    name: "Empresarial",
    description: "Para equipos y agencias creativas que necesitan más.",
    price: 79,
    period: "/mes",
    duration: "Historial ilimitado ",
    color: "purple",
    features: [
      { text: "Usuarios ilimitados", available: true },
      { text: "Almacenamiento en la nube", available: true },
      { text: "IA personalizada", available: true },
      { text: "Gestión avanzada de proyectos", available: true },
      { text: "Soporte 24/7 dedicado", available: true },
      { text: "Acceso a betas exclusivas", available: true },
    ],
    buttonText: "Contactar equipo Pixpar",
    buttonStyle: "primary",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const PricingPage: React.FC = () => {
  return (
    <div className="pricing-page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pricing-header"
      >
        <h1 className="pricing-title">Elige tu plan Pixpar</h1>
        <p className="pricing-subtitle">
          Explora tu creatividad con el plan que mejor se adapte a ti.
        </p>
      </motion.div>

      <motion.div
        className="pricing-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            variants={item}
            className={`pricing-card border-${plan.color}`}
          >
            <div className="pricing-card-header">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
            </div>

            <div className="pricing-card-price">
              {plan.price === 0 ? (
                <span className="price-free">Gratis</span>
              ) : (
                <>
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </>
              )}
            </div>

            <p className="pricing-duration">
              <Icon icon="lucide:clock" /> {plan.duration}
            </p>

            <ul className="pricing-features">
              {plan.features.map((feature, fIdx) => (
                <li
                  key={fIdx}
                  className={`pricing-feature ${
                    !feature.available ? "unavailable" : ""
                  }`}
                >
                  <Icon
                    icon={feature.available ? "lucide:check" : "lucide:x"}
                    className="feature-icon"
                  />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              className={`pricing-btn btn-${plan.buttonStyle}`}
              onClick={() => console.log(`Plan seleccionado: ${plan.name}`)}
            >
              {plan.buttonText}
              <Icon icon="lucide:arrow-right" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PricingPage;
