import React from 'react';
import { cn } from '@/src/lib/utils';
import { ContentCategory, ContentType } from '@/src/types/content';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'news' | 'movie' | 'social' | 'trending' | 'outline' | 'category';
  category?: ContentCategory;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  category,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors select-none';

  const variantStyles = {
    default: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60',
    news: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold',
    movie: 'bg-green-600/10 text-green-700 dark:text-green-300 border border-green-500/20 font-semibold',
    social: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold',
    trending: 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white border border-emerald-500/30 font-bold shadow-sm',
    outline: 'border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-semibold',
    category: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold',
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};
