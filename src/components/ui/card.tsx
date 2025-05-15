// src/components/ui/card.tsx
import React from 'react';

// Card 组件
export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardContent 组件
export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>;
};

