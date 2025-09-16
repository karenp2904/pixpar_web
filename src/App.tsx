import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import Layout from "./components/navbar/Layout";
import LoginPage from "./pages/login/LoginPage";
import FeaturesSection from "./components/features-section/FeaturesSection";
import PricingSection from "./components/pricing-section/PricingSection";
import RegisterPage from "./pages/Register/register";
import { SelectorTypeEdition } from "./pages/typeEditor/selectorEdition";
import BatchEditor from "./pages/editorLote/BatchEditor";

const App: React.FC = () => {
  return (
    <Routes>
      {/* Rutas que comparten navbar */}
      <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
       
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/features" element={<FeaturesSection />} />
          <Route path="/typeEdition" element={<SelectorTypeEdition />} />
          <Route path="/editorLote" element={<BatchEditor />} />
          <Route path="/prices" element={<PricingSection />} />
          <Route path="/about" element={<div className="p-8 text-center">Acerca de</div>} />

          {/* 404 dentro del mismo layout */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
                  <p className="text-xl text-gray-400 mb-8">Página no encontrada</p>
                  <a href="/home" className="hero-button-primary">Volver al inicio</a>
                </div>
              </div>
            }
          />
        </Route>
    </Routes>
  );
};

export default App;
