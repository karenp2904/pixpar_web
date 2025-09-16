import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Icon } from "@iconify/react";
import authService from "../../services/userService"; // importa el servicio

// Simulación de servidor: login
const fakeAuth = async (email: string, password: string) => {
  return new Promise<{ ok: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      if (email === "demo@pixpar.com" && password === "password") {
        resolve({ ok: true });
      } else {
        resolve({ ok: false, message: "Correo o contraseña incorrectos" });
      }
    }, 900);
  });
};

// Simulación de servidor: registro (puedes dejarlo si lo usas en otra parte)
const fakeRegister = async (email: string, password: string) => {
  return new Promise<{ ok: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      if (email === "demo@pixpar.com") {
        resolve({ ok: false, message: "El correo ya está registrado" });
      } else {
        resolve({ ok: true });
      }
    }, 1000);
  });
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!email) return "Ingresa tu correo";
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Correo inválido";
    if (!password) return "Ingresa tu contraseña";
    if (password.length < 4)
      return "La contraseña debe tener al menos 4 caracteres";
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  const v = validate();
  if (v) {
    setError(v);
    return;
  }

  setLoading(true);
  const res = await authService.login(email.trim(), password);
  setLoading(false);

  if (!res.ok) {
    setError(res.message || "Error de autenticación");
    return;
  }

  // Guardar sesión con token y datos de usuario
  authService.saveSession(res.token || "", res.user || { name: "", email }, remember);

  navigate("/editor");
};

  const goToRegister = () => {
    navigate("/register"); //  ruta de registro
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo">PixPar</div>
          <p className="subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <form className="login-form" onSubmit={handleLogin} noValidate>
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <label className="field">
            <span className="label-text">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              aria-label="Correo"
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
                aria-pressed={showPassword}
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
              aria-label="Contraseña"
              className="input"
            />
          </label>

          <div className="row spaced">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recordarme</span>
            </label>

            <button
              type="button"
              className="link-btn"
              onClick={() =>
                alert("Funcionalidad de recuperar contraseña (demo)")
              }
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" aria-hidden /> : null}
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>

          <div className="divider">
            <span>o</span>
          </div>

          <div className="signup">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={goToRegister} // Usa navigate
              disabled={loading}
            >
              Regístrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
