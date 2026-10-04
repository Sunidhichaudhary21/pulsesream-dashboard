import React from 'react';
import { cn } from '@/src/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, rightElement, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-extrabold uppercase tracking-wider text-emerald-950">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-emerald-600 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-label={props['aria-label'] || label || props.placeholder}
            className={cn(
              'w-full rounded-2xl bg-white border border-emerald-200/90 text-emerald-950 placeholder-emerald-800/40 text-sm px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 shadow-sm font-medium',
              icon && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-emerald-600 focus:ring-emerald-600/50 focus:border-emerald-600',
              className
            )}
            {...props}
          />
          {rightElement && <div className="absolute right-3.5 flex items-center">{rightElement}</div>}
        </div>
        {error && <p className="text-xs text-emerald-600 mt-1 font-semibold">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
