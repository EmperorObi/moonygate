
'use client';

import { usePageLoading } from '@/contexts/loading-context';
import { Loader2 } from 'lucide-react';

export function PageLoader() {
  const { isLoading, progress } = usePageLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-xl font-semibold text-primary">{progress}%</p>
      </div>
    </div>
  );
}
