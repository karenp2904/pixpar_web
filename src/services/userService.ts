import { AuthPreferences } from "./LocalStorage/AuthPreferences";

export interface AuthResponse {
  ok: boolean;
  message?: string;
  token?: string;
  user?: {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
  };
}

class AuthService {
  private API_BASE = "http://10.152.190.78:5000/api/auth"; // backend

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
        const resUser= await res.json();
        console.log("Respuesta del login:", resUser);
        if(resUser.user){
          AuthPreferences.saveUser(
                    {
                      id: resUser.user.id,
                      name: `${resUser.user.first_name} ${resUser.user.last_name}`, //  Concatenado correctamente
                      email: resUser.user.email,
                    },
                    resUser.access_token //  Pasa el token
            ); 
          resUser.ok=true; 
        }
      return resUser;
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
      return { ok: false, message: "No se pudo conectar con el servidor"  };
    }
  }

  
}

export default new AuthService();
