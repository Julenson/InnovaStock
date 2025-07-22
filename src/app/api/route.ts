// src/app/api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '../../../db/managedb';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await getUser(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Login correcto' });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
