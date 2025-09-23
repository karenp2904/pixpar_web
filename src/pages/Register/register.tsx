import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/LoginPage.css";
import { Icon } from "@iconify/react";
import authService from "../../services/userService";
import "./register.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!first_name.trim()) return "Ingresa tu nombre";
    if (!last_name.trim()) return "Ingresa tu apellido";
    if (!email.trim()) return "Ingresa tu correo";
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Correo inválido";
    if (!password) return "Crea una contraseña";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (password !== confirmPassword) return "Las contraseñas no coinciden";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const res = await authService.register(
      {email, password , first_name, last_name, phone, address}
    );
    setLoading(false);

    if (!res.ok) {
      setError(res.message || "Error al registrar");
      return;
    }

    alert("✅ Registro exitoso, ahora inicia sesión");
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-card register-card">
        <div className="login-brand">
          <div className="logo">PixPar</div>
          <p className="subtitle">Crea tu cuenta en segundos</p>
        </div>

        <form className="login-form" onSubmit={onSubmit} noValidate>
          {error && <div className="login-error">{error}</div>}

          {/* Nombre y Apellido en la misma fila */}
          <div className="name-row">
            <label className="field">
              <span className="label-text">Nombre</span>
              <input
                type="text"
                value={first_name}
                onChange={(e) => setfirst_name(e.target.value)}
                placeholder="Ej: Juan"
                className="input"
              />
            </label>

            <label className="field">
              <span className="label-text">Apellido</span>
              <input
                type="text"
                value={last_name}
                onChange={(e) => setlast_name(e.target.value)}
                placeholder="Ej: Pérez"
                className="input"
              />
            </label>
          </div>
          
          <div className="name-row">
            <label className="field">
              <span className="label-text">Dirección</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Calle 123 #45-67"
                className="input"
              />
            </label>

            <label className="field">
              <span className="label-text">Teléfono</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 3001234567"
                className="input"
              />
            </label>
          </div>
         

          <label className="field">
            <span className="label-text">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              className="input email-input"
            />
          </label>

          <div className="name-row">
            <label className="field">
              <div className="label-row">
                <span className="label-text">Contraseña</span>
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </label>

            <label className="field">
              <span className="label-text">Confirmar contraseña</span>
              <Icon
                    icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                    width={20}
                    height={20}
                  />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
              
            </label>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          <div className="divider"><span>o</span></div>

          <div className="signup">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
