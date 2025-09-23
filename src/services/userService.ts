export interface AuthResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
  };
}

class AuthService {
  private API_BASE = "http://10.152.190.16:5000/api/auth"; // backend

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${this.API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return { ok: false, message: `Error ${res.status}: ${res.statusText}` };
      }

      return await res.json();
    } catch (error) {
      console.error("Error en login:", error);
      return { ok: false, message: "No se pudo conectar con el servidor" };
    }
  }

  async register(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    
  }): Promise<AuthResponse> {
    try {
      const res = await fetch(`${this.API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), //  Enviamos el objeto completo
      });


      console.log("Respuesta del registro:", res);
      if (!res.ok) {
        return { ok: false, message: `Error ${res.status}: ${res.statusText}` };
      }

      return await res.json();
    } catch (error) {
      console.error("Error en registro:", error);
      return { ok: false, message: "No se pudo conectar con el servidor" };
    }
  }

  saveSession(
    token: string,
    user: { firstName: string; lastName: string; email: string },
    remember: boolean
  ) {
    const sessionData = JSON.stringify({
      token,
      user,
      time: new Date().toISOString(),
    });

    if (remember) {
      localStorage.setItem("pixpar_session", sessionData);
    } else {
      sessionStorage.setItem("pixpar_session", sessionData);
    }
  }

  logout() {
    localStorage.removeItem("pixpar_session");
    sessionStorage.removeItem("pixpar_session");
  }

  getSession() {
    const session =
      localStorage.getItem("pixpar_session") ||
      sessionStorage.getItem("pixpar_session");
    return session ? JSON.parse(session) : null;
  }
}

export default new AuthService();
