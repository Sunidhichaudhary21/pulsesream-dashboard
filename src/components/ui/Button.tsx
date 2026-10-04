import React from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl active:scale-[0.98]';

    const variants = {
      primary:
        'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-md shadow-emerald-600/25 border border-emerald-500/30 font-semibold',
      secondary:
        'bg-white dark:bg-[#0d2e22] text-emerald-950 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-[#113a2c] border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm font-semibold',
      outline:
        'border border-emerald-300 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/80 hover:border-emerald-400 font-semibold',
      ghost:
        'text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 hover:text-emerald-950 dark:hover:text-white font-medium',
      danger:
        'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md shadow-emerald-900/25 border border-emerald-700 font-semibold',
      glass:
        'bg-white/90 dark:bg-[#0b271d]/90 backdrop-blur-md border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100 hover:bg-white dark:hover:bg-[#0f3427] shadow-sm font-semibold',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'p-2 rounded-xl text-sm',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
