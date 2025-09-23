import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./AppNavbar.css";
import { saveTransformsService, exportTransformsService } from "../../services/buttons/editorActions";

const AppNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isEditorPage = location.pathname.startsWith("/editor");

  const handleSave = async () => {
    await saveTransformsService();
    alert("✅ Transformaciones guardadas correctamente.");
  };

  const handleExport = async () => {
    try {
      await exportTransformsService();
      alert("📤 Exportación completada.");
    } catch {
      alert("❌ Hubo un problema al exportar.");
    }
  };

  const navLinks = [
    { href: "/home", label: "Inicio" },
    { href: "/features", label: "Características" },
    { href: "/prices", label: "Precios" },
    { href: "/editorLote", label: "Editor" }
  ];

  return (
    <nav className={`app-navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          <img src="../../../logoo.png" alt="-" className="navbar-logo-img" />
          <span className="navbar-logo-text">PixPar</span>
        </Link>

        <ul className="navbar-nav">
          {navLinks.map((link) => (
            <li key={link.href} className="navbar-nav-item">
              <Link
                to={link.href}
                className={`navbar-nav-link ${location.pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {isEditorPage ? (
            <>
              <button className="navbar-button navbar-button-ghost" onClick={handleSave}>
                <Icon icon="lucide:save" className="mr-2" />
                Guardar
              </button>
              <button className="navbar-button navbar-button-primary" onClick={handleExport}>
                <Icon icon="lucide:download" className="mr-2" />
                Exportar
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar-button navbar-button-primary">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
