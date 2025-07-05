import React from 'react';

interface EmertrixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const EmertrixLogo: React.FC<EmertrixLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src="/lovable-uploads/bb07afb4-8431-4e5f-b1e3-042aab5fa926.png"
        alt="Emertrix Logo"
        className={`${sizeClasses[size]} w-auto`}
      />
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>EMERTRIX</span>
      )}
    </div>
  );
};
