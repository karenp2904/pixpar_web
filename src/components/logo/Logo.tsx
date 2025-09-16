import React from 'react';
import { Icon } from '@iconify/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClass = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }[size];
  
  return (
    <div className={`flex items-center justify-center rounded-md bg-gradient-to-br from-primary to-secondary p-1 ${sizeClass}`}>
      <Icon icon="lucide:image" className="text-black" />
    </div>
  );
};

export default Logo;