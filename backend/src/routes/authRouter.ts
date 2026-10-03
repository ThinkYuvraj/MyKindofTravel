import express from 'express';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export const authRouter = express.Router();

const CREDENTIALS_FILE = path.join(process.cwd(), 'cms-credentials.json');

export interface AdminCredentials {
  email: string;
  passwordHash: string;
  updatedAt: string;
}

export function getStoredCredentials(): AdminCredentials {
  if (fs.existsSync(CREDENTIALS_FILE)) {
    try {
      const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.email && parsed.passwordHash) {
        return parsed;
      }
    } catch (e) {
      console.error('Error reading credentials file, falling back to env default', e);
    }
  }

  const defaultCreds: AdminCredentials = {
    email: env.adminEmail,
    passwordHash: env.adminPassword,
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaultCreds, null, 2));
  } catch (err) {
    console.error('Error writing default credentials file', err);
  }

  return defaultCreds;
}

export function saveCredentials(creds: AdminCredentials) {
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2));
}

// Handler for login endpoints
const handleLogin = (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  const currentCreds = getStoredCredentials();

  if (
    email &&
    password &&
    email.trim().toLowerCase() === currentCreds.email.trim().toLowerCase() &&
    password === currentCreds.passwordHash
  ) {
    res.json({
      token: 'secure-admin-token-' + Date.now(),
      user: {
        email: currentCreds.email,
        role: 'Super Admin',
        lastLogin: new Date().toISOString(),
      },
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password.' });
  }
};

authRouter.post('/login', handleLogin);

authRouter.get('/profile', (req, res) => {
  const currentCreds = getStoredCredentials();
  res.json({
    email: currentCreds.email,
    role: 'Super Admin',
    lastUpdated: currentCreds.updatedAt,
  });
});

authRouter.post('/update-credentials', (req, res) => {
  const { currentPassword, newEmail, newPassword } = req.body;
  const currentCreds = getStoredCredentials();

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required to authorise changes.' });
  }

  if (currentPassword !== currentCreds.passwordHash) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  if (newEmail && !newEmail.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (newPassword && newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const updatedCreds: AdminCredentials = {
    email: newEmail ? newEmail.trim() : currentCreds.email,
    passwordHash: newPassword ? newPassword : currentCreds.passwordHash,
    updatedAt: new Date().toISOString(),
  };

  try {
    saveCredentials(updatedCreds);
    res.json({
      success: true,
      message: 'Admin credentials updated successfully on the server!',
      user: {
        email: updatedCreds.email,
        role: 'Super Admin',
        lastUpdated: updatedCreds.updatedAt,
      },
    });
  } catch (err: any) {
    console.error('Error saving credentials:', err);
    res.status(500).json({ error: 'Failed to write credentials to server.' });
  }
});
