'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { InnovaTrackLogo } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // limpiar error previo

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error desconocido');
        return;
      }

      // Login correcto, redirigir
      router.push('/dashboard');
    } catch (err) {
      setError('Error en la conexión');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-body">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <InnovaTrackLogo className="h-16 w-16" />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline">
            Innova-Sport
          </h1>
          <p className="text-muted-foreground">Inventory Management</p>
        </div>
      </div>
      <Card className="w-full max-w-sm border-2 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenido</CardTitle>
          <CardDescription>
            Introduce tu email para iniciar sesión.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="pl-10"
                  defaultValue="demo@innovasport.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10"
                  defaultValue="demopassword"
                />
              </div>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; 2024 Innova-Sport. All Rights Reserved.
      </p>
    </div>
  );
}
