import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@db/managedb';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await getUser(email, password);
  if (!user) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }
  return NextResponse.json({ message: 'Login correcto' });
}
