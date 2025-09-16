import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/LoginPage.css";
import { Icon } from "@iconify/react";
import authService from "../../services/userService"; // 👈 Servicio centralizado
import "./register.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!name.trim()) return "Ingresa tu nombre";
    if (!email.trim()) return "Ingresa tu correo";
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Correo inválido";
    if (!password) return "Crea una contraseña";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";
    if (password !== confirmPassword)
      return "Las contraseñas no coinciden";
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
    const res = await authService.register(name.trim(), email.trim(), password);
    setLoading(false);

    if (!res.ok) {
      setError(res.message || "Error al registrar");
      return;
    }

    // Feedback al usuario
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

          <label className="field">
            <span className="label-text">Nombre completo</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="input"
            />
          </label>

          <label className="field">
            <span className="label-text">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              className="input"
            />
          </label>

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
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </label>

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
