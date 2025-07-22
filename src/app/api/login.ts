// src/app/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@db/managedb';
import { NextResponse } from '@genkit-ai/next';

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
      console.log('Invalid credentials');
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    console.log('User found:', user.mail);
    return NextResponse.json({ message: 'Login correcto' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
