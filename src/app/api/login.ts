// src/app/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@db/managedb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const user = await getUser(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Aquí podrías crear sesión, JWT, cookies, etc. según tu auth strategy
    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
