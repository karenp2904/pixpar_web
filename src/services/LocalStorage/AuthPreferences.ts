
const AUTH_KEY = "pixpar_user";
const TOKEN_KEY = "pixpar_token";

export const AuthPreferences = {
  saveUser: (user: { id: number; name: string; email: string }, token: string) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token); // Guardar el token como texto plano
    console.log("Usuario guardado en localStorage:", user);
  },

  getUser: () => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearUser: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY); // Asegurarse de borrar el token también
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_KEY) && !!localStorage.getItem(TOKEN_KEY);
  },
};
