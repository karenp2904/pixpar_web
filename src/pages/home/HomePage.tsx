import React from 'react';
import HeroSection from '../../components/hero-section/HeroSection';
import FeaturesSection from '../../components/features-section/FeaturesSection';
import PricingSection from '../../components/pricing-section/PricingSection';
import Footer from '../../components/footer/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pixpar-black text-pixpar-white">
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;