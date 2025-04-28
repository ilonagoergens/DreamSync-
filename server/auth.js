// server/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Funktion zum Erzeugen eines JWT
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Funktion zur Überprüfung des Passworts
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Funktion zur Verifizierung des Tokens
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);  // Überprüft das Token
  } catch (error) {
    throw new Error('Token ist ungültig oder abgelaufen');
  }
}
