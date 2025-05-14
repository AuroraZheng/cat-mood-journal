// src/components/ui/button.tsx
import React from 'react';

// 按钮组件
interface ButtonProps {
  onClick: () => void;  // 点击事件
  children: React.ReactNode;  // 按钮内容
  className?: string;  // 可选的自定义样式类
}

// Button 组件
export const Button = ({ onClick, children, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-700 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};
