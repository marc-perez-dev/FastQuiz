import React, { type ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link' | 'ghost' | 'next' | 'upload';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', fullWidth, children, ...props }, ref) => {
    const baseStyles = 'cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold';
    
    const variants = {
      primary: 'px-8 py-4 bg-earth-green text-stone-50 text-sm tracking-wider uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-earth-green-hover',
      secondary: 'px-6 py-4 bg-transparent border-2 border-stone-900 text-stone-900 tracking-wider uppercase hover:bg-stone-200',
      // 'next' is slightly different in the original CSS (rounded-lg, no uppercase, flex)
      next: 'px-8 py-3 bg-earth-green text-stone-50 rounded-lg shadow-lg hover:bg-earth-green-hover flex items-center justify-center gap-2',
      upload: 'px-8 py-3 bg-earth-green hover:bg-earth-green-hover text-stone-50 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] uppercase tracking-wider inline-block text-center',
      link: 'text-sm font-medium text-stone-600 hover:text-stone-900 underline decoration-2 underline-offset-4 bg-transparent border-none p-0',
      ghost: 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100'
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
