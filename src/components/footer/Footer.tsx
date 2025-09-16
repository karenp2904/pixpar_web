import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import "./Footer.css";

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    product: [
      { label: 'Características', href: '/caracteristicas' },
      { label: 'Editor', href: '/editor' },
      { label: 'Precios', href: '/precios' },
    ],
    company: [
      { label: 'Acerca de', href: '/' },
      { label: 'Blog', href: '/' },
      { label: 'Carreras', href: '/' },
      { label: 'Contacto', href: '/' }
    ],
    support: [
      { label: 'Centro de ayuda', href: '/' },
      { label: 'Documentación', href: '/' },
      { label: 'Estado del servicio', href: '/' },
      { label: 'Reportar problema', href: '/' }
    ]
  };

  const socialLinks = [
    { icon: 'lucide:twitter', href: 'https://twitter.com/pixpar', label: 'Twitter' },
    { icon: 'lucide:github', href: 'https://github.com/pixpar', label: 'GitHub' },
    { icon: 'lucide:linkedin', href: 'https://linkedin.com/company/pixpar', label: 'LinkedIn' },
    { icon: 'lucide:instagram', href: 'https://instagram.com/pixpar', label: 'Instagram' }
  ];

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              PixPar
            </Link>
            <p className="footer-description">
              La herramienta de edición de imágenes más potente y fácil de usar. 
              Transforma tus ideas en realidad con la ayuda de la inteligencia artificial.
            </p>
            <div className="footer-social">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  title={social.label}
                >
                  <Icon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">Producto</h3>
            <ul className="footer-links">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">Empresa</h3>
            <ul className="footer-links">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">Soporte</h3>
            <ul className="footer-links">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-newsletter">
          <h3 className="footer-newsletter-title">
            Mantente actualizado
          </h3>
          <p className="footer-newsletter-description">
            Recibe las últimas noticias, actualizaciones y tips directamente en tu bandeja de entrada.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="footer-newsletter-input"
              required
            />
            <button 
              type="submit" 
              className="footer-newsletter-button"
              disabled={isSubscribed}
            >
              {isSubscribed ? (
                <>
                  <Icon icon="lucide:check" />
                  ¡Suscrito!
                </>
              ) : (
                <>
                  <Icon icon="lucide:send" />
                  Suscribirse
                </>
              )}
            </button>
          </form>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} PixPar. Todos los derechos reservados.
          </div>
          
          <ul className="footer-bottom-links">
            <li>
              <Link to="/privacy" className="footer-bottom-link">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link to="/terms" className="footer-bottom-link">
                Términos de servicio
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="footer-bottom-link">
                Política de cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;