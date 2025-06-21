
// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Oops! The page you&apos;re looking for doesn&apos;t seem to exist.
      </p>
      <Button asChild>
        <Link href="/">Go Back to Dashboard</Link>
      </Button>
    </div>
  );
}
