import React from 'react';

interface EmertrixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'black' | 'white';
}

export const EmertrixLogo: React.FC<EmertrixLogoProps> = ({
  size = 'md',
  className = '',
  variant = 'black',
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  const logoSrc =
    variant === 'white'
      ? '/src/assets/images/logo-white.svg'
      : '/src/assets/images/logo-black.png';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src={logoSrc}
        alt="Emertrix Logo"
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};
