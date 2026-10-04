'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load feed content from server. Please check your connection or try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-6 rounded-3xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-300 mb-1">{title}</h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="gap-2 font-semibold">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Feed</span>
        </Button>
      )}
    </div>
  );
};
