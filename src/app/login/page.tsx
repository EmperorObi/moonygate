// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn, AlertCircle } from 'lucide-react';

// TODO: Import Firebase auth methods from your firebaseClient.ts
// import { auth } from '@/lib/firebase/firebaseClient';
// import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // --- TODO: Firebase Client-Side Authentication ---
    // 1. Replace this alert with actual Firebase login
    // try {
    //   const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //   // Signed in 
    //   const user = userCredential.user;
    //   // Firebase automatically handles token persistence.
    //   // You might store user profile info in a global state/context if needed.
    //   console.log('Login successful:', user);
    //   router.push('/'); // Redirect to dashboard or intended page
    // } catch (err: any) {
    //   console.error("Login error:", err);
    //   setError(err.message || 'Failed to login. Please check your credentials.');
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End of TODO ---
    
    // Placeholder logic (remove when Firebase auth is implemented)
    if (email === 'admin@example.com' && password === 'LagosUyo') {
        alert('Login successful (placeholder)! Implement Firebase client auth.');
        // In a real scenario, Firebase handles token. For now, just redirect.
        router.push('/');
    } else {
        setError('Invalid credentials (placeholder). Ensure admin@example.com is registered in Firebase with password LagosUyo.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Please sign in to access your Mooney gateway dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="LagosUyo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Ensure admin user (e.g., admin@example.com) is registered in Firebase with the password 'LagosUyo'.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
