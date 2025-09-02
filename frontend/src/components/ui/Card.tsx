import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass' | 'gradient' | 'bordered' | 'elevated' | 'fitness' | 'success' | 'energy';
  hover?: boolean;
  onClick?: () => void;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  hover = true,
  onClick,
  rounded = '2xl'
}) => {
  const paddingClasses = {
    none: '',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variantClasses = {
    default: `
      bg-white border border-slate-200/60 shadow-card
      ${hover ? 'hover:shadow-card-hover hover:border-slate-300/60 hover:-translate-y-0.5' : ''}
    `.trim(),
    
    glass: `
      bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl
      ${hover ? 'hover:bg-white/90 hover:shadow-2xl hover:-translate-y-0.5' : ''}
    `.trim(),
    
    gradient: `
      bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 shadow-card
      ${hover ? 'hover:shadow-card-hover hover:from-slate-50 hover:to-slate-100 hover:-translate-y-0.5' : ''}
    `.trim(),
    
    bordered: `
      bg-white border-2 border-fitness-200 shadow-sm
      ${hover ? 'hover:border-fitness-300 hover:shadow-md hover:-translate-y-0.5' : ''}
    `.trim(),
    
    elevated: `
      bg-white shadow-xl-soft border border-slate-100
      ${hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''}
    `.trim(),
    
    fitness: `
      bg-gradient-to-br from-fitness-50 to-fitness-100 border border-fitness-200/60 shadow-fitness/10
      ${hover ? 'hover:shadow-fitness/20 hover:from-fitness-100 hover:to-fitness-150 hover:-translate-y-0.5' : ''}
    `.trim(),
    
    success: `
      bg-gradient-to-br from-success-50 to-success-100 border border-success-200/60 shadow-success/10
      ${hover ? 'hover:shadow-success/20 hover:from-success-100 hover:to-success-150 hover:-translate-y-0.5' : ''}
    `.trim(),
    
    energy: `
      bg-gradient-to-br from-energy-50 to-energy-100 border border-energy-200/60 shadow-energy/10
      ${hover ? 'hover:shadow-energy/20 hover:from-energy-100 hover:to-energy-150 hover:-translate-y-0.5' : ''}
    `.trim(),
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  const clickableClasses = onClick ? 'cursor-pointer select-none active:scale-95' : '';
  const transitionClasses = 'transition-all duration-300';

  const classes = [
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    clickableClasses,
    transitionClasses,
    'overflow-hidden',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'minimal';
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'border-b border-slate-200/60 pb-4 mb-6',
    gradient: 'border-b border-gradient-to-r from-slate-200 via-slate-300 to-slate-200 pb-4 mb-6 bg-gradient-to-r from-transparent via-slate-50 to-transparent',
    minimal: 'pb-3 mb-4'
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className = '',
  size = 'md',
  gradient = false
}) => {
  const sizeClasses = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold'
  };

  const gradientClass = gradient ? 'text-gradient' : 'text-slate-900';

  return (
    <h3 className={`${sizeClasses[size]} ${gradientClass} tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '',
  spacing = 'none'
}) => {
  const spacingClasses = {
    none: '',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6'
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`border-t border-slate-200/60 pt-4 mt-6 ${className}`}>
    {children}
  </div>
);

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'auto'
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    auto: ''
  };

  return (
    <div className={`${aspectClasses[aspectRatio]} overflow-hidden ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};

export default Card;