import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import "./PricingSection.css";

const plans = [
  {
    name: 'Básico',
    description: 'Perfecto para uso personal y proyectos pequeños',
    price: 0,
    period: 'Gratis',
    features: [
      { text: 'Hasta 10 imágenes por mes', available: true },
      { text: 'Filtros básicos', available: true },
      { text: 'Resolución hasta 1080p', available: true },
      { text: 'Soporte por email', available: true },
      { text: 'Filtros avanzados con IA', available: false },
      { text: 'Procesamiento en lote', available: false }
    ],
    buttonText: 'Comenzar gratis',
    buttonStyle: 'secondary',
    popular: false
  },
  {
    name: 'Pro',
    description: 'Ideal para profesionales y equipos creativos',
    price: 19,
    period: '/mes',
    features: [
      { text: 'Imágenes ilimitadas', available: true },
      { text: 'Todos los filtros y efectos', available: true },
      { text: 'Resolución hasta 4K', available: true },
      { text: 'Procesamiento en lote', available: true },
      { text: 'API de integración', available: true },
      { text: 'Soporte prioritario', available: true }
    ],
    buttonText: 'Empezar prueba gratuita',
    buttonStyle: 'featured',
    popular: true
  },
  {
    name: 'Empresas',
    description: 'Solución completa para grandes organizaciones',
    price: 99,
    period: '/mes',
    features: [
      { text: 'Todo lo incluido en Pro', available: true },
      { text: 'Usuarios ilimitados', available: true },
      { text: 'Almacenamiento en la nube', available: true },
      { text: 'Gestión de equipos', available: true },
      { text: 'Soporte 24/7 dedicado', available: true },
      { text: 'SLA garantizado', available: true }
    ],
    buttonText: 'Contactar ventas',
    buttonStyle: 'primary',
    popular: false
  }
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PricingSection: React.FC = () => {
  return (
    <section className="pricing-section" id="precios">
      <div className="pricing-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="pricing-title">Planes para cada necesidad</h2>
          <p className="pricing-subtitle">
            Elige el plan que mejor se adapte a tu flujo de trabajo y comienza a transformar tus imágenes hoy mismo
          </p>
        </motion.div>

        <motion.div 
          className="pricing-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`pricing-card ${plan.popular ? 'featured' : ''}`}
            >
              <div>
                <div className="pricing-plan-name">{plan.name}</div>
                <div className="pricing-plan-description">{plan.description}</div>
                <div className="pricing-price">
                  <span className="pricing-currency">$</span>
                  <span className="pricing-amount">{plan.price}</span>
                  <span className="pricing-period">{plan.period}</span>
                </div>

                <ul className="pricing-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`pricing-feature ${!feature.available ? 'unavailable' : ''}`}
                    >
                      <Icon 
                        icon={feature.available ? "lucide:check" : "lucide:x"} 
                        className="pricing-feature-icon" 
                      />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón sin navegación */}
              <button 
                className={`pricing-button pricing-button-${plan.buttonStyle}`}
                onClick={() => console.log(`Plan seleccionado: ${plan.name}`)}
              >
                {plan.buttonText}
                <Icon icon="lucide:arrow-right" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="pricing-guarantee"
        >
          <Icon icon="lucide:shield-check" className="pricing-guarantee-icon" />
          <p>Garantía de devolución de dinero de 30 días. Sin compromisos a largo plazo.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
