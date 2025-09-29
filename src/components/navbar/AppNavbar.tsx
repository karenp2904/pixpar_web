import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AppNavbar.css";
import { AuthPreferences } from "../../services/LocalStorage/AuthPreferences";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AppNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(AuthPreferences.getUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Recarga usuario si cambia la ruta
  useEffect(() => {
    setUser(AuthPreferences.getUser());
  }, [location]);

  const handleLogout = () => {
    AuthPreferences.clearUser();
    setUser(null);
    setIsMenuOpen(false);
    navigate("/login"); //  ruta de registro
  };

  const navLinks = [
    { href: "/home", label: "Inicio" },
    { href: "/features", label: "Características" },
    { href: "/projects", label: "Proyectos" },
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
          {!user ? (
            <Link to="/login" className="navbar-button navbar-button-primary">
              Iniciar sesión
            </Link>
          ) : (
            <div className="navbar-user">
              <FaUserCircle
                className="navbar-user-icon"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              />
              {isMenuOpen && (
                <div className="navbar-user-dropdown">
                  <p className="navbar-user-name">{user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="navbar-button navbar-button-ghost"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
