import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import "./FeaturesSection.css";

const features = [
  {
    icon: 'lucide:sparkles',
    title: 'Filtros inteligentes',
    description: 'Aplica filtros avanzados con IA que se adaptan automáticamente a tu imagen para obtener resultados profesionales'
  },
  {
    icon: 'lucide:settings',
    title: 'Editor avanzado',
    description: 'Herramientas profesionales de edición con controles precisos para ajustar cada detalle de tus imágenes'
  },
  {
    icon: 'lucide:cpu',
    title: 'Procesamiento AI',
    description: 'Algoritmos de última generación que transforman y mejoran tus imágenes con un solo clic'
  },
  {
    icon: 'lucide:plug',
    title: 'Integración fácil',
    description: 'Conecta con tus aplicaciones favoritas y flujos de trabajo sin complicaciones técnicas'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="features-section">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="features-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Características principales
        </motion.h2>

        <motion.div 
          className="features-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={item}
              className="feature-card"
            >
              <div className={`feature-icon-container ${
                index % 4 === 0 ? 'green' : 
                index % 4 === 1 ? 'blue' : 
                index % 4 === 2 ? 'purple' : 'pink'
              }`}>
                <Icon icon={feature.icon} className="feature-icon" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;