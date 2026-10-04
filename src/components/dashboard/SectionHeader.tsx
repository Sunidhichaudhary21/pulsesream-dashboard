import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-4 select-none">
      <div className="flex items-center gap-2.5">
        {icon && (
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
