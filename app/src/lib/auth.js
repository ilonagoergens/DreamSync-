import create from 'zustand';

// Zustand für die Authentifizierung
export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userId: null,
  token: null,
  userProfile: null,

  // Login-Funktion
  loginWithEmail: async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        set({
          isAuthenticated: true,
          userId: data.userId,
          token: data.token,
          userProfile: { email }, // Hier kannst du ggf. mehr User-Daten speichern
        });
        // Token im LocalStorage speichern
        localStorage.setItem('authToken', data.token);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      throw new Error('Anmeldung fehlgeschlagen');
    }
  },

  // Registrierung-Funktion
  registerWithEmail: async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        set({
          isAuthenticated: true,
          userId: data.userId,
          token: data.token,
          userProfile: { email },
        });
        // Token im LocalStorage speichern
        localStorage.setItem('authToken', data.token);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Registrierung fehlgeschlagen:', error);
      throw new Error('Registrierung fehlgeschlagen');
    }
  },

  // Logout-Funktion
  logout: () => {
    set({
      isAuthenticated: false,
      userId: null,
      token: null,
      userProfile: null,
    });
    // Token aus LocalStorage entfernen
    localStorage.removeItem('authToken');
  },
}));
