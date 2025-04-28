// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateToken, verifyToken } from './auth.js';
import { getDatabase, createUser, getUserByEmail } from './database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpunkt für die Registrierung
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
  }

  try {
    // Benutzer in der Datenbank erstellen
    const user = await createUser(email, password);
    const token = generateToken(user.id);  // Token für den neuen Benutzer erstellen
    res.status(201).json({ userId: user.id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
});

// Endpunkt für das Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
  }

  try {
    // Benutzer anhand der E-Mail-Adresse finden
    const user = await getUserByEmail(email);
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Token für den angemeldeten Benutzer erstellen
    const token = generateToken(user.id);
    res.json({ userId: user.id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler bei der Anmeldung' });
  }
});

// Middleware für den Schutz von Routen, die ein Token erfordern
app.use('/api/protected', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Token aus Header extrahieren
  if (!token) {
    return res.status(403).json({ error: 'Token erforderlich' });
  }

  try {
    const decoded = verifyToken(token);  // Token überprüfen
    req.user = decoded;  // Benutzer aus der Payload des Tokens extrahieren
    next();  // Nächste Middleware aufrufen
  } catch (error) {
    res.status(401).json({ error: 'Token ungültig oder abgelaufen' });
  }
});

// Starten des Servers
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
