import React, { type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'upload' | 'question' | 'result';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'base', children, ...props }, ref) => {
    
    const variants = {
      base: 'border-stone-900 shadow-[4px_4px_0px_0px_rgba(41,36,25,1)]',
      upload: 'mt-16 p-8 bg-stone-200 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(41,36,25,1)] max-w-2xl mx-auto',
      question: 'bg-stone-50 border-2 border-stone-900 p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(41,36,25,1)]',
      result: 'w-64 h-64 border-4 border-stone-900 flex flex-col items-center justify-center mb-12 bg-stone-50 shadow-[8px_8px_0px_0px_rgba(41,36,25,1)]'
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
