import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'energy' | 'fitness' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = 'xl',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-semibold
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-all duration-300 transform
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${fullWidth ? 'w-full' : ''}
  `.trim();
  
  const variantClasses = {
    primary: `
      bg-fitness-gradient text-white shadow-fitness 
      hover:shadow-xl hover:shadow-fitness-500/30 hover:-translate-y-0.5
      focus:ring-fitness-500 focus:ring-offset-white
      active:shadow-lg
    `.trim(),
    
    secondary: `
      bg-white text-fitness-700 border-2 border-fitness-200 
      hover:border-fitness-300 hover:bg-fitness-50 hover:-translate-y-0.5
      shadow-card hover:shadow-card-hover
      focus:ring-fitness-500 focus:ring-offset-white
    `.trim(),
    
    success: `
      bg-success-gradient text-white shadow-success 
      hover:shadow-xl hover:shadow-success-500/30 hover:-translate-y-0.5
      focus:ring-success-500 focus:ring-offset-white
      active:shadow-lg
    `.trim(),
    
    energy: `
      bg-energy-gradient text-white shadow-energy 
      hover:shadow-xl hover:shadow-energy-500/30 hover:-translate-y-0.5
      focus:ring-energy-500 focus:ring-offset-white
      active:shadow-lg
    `.trim(),
    
    fitness: `
      bg-fitness-600 text-white 
      hover:bg-fitness-700 hover:shadow-lg hover:-translate-y-0.5
      focus:ring-fitness-500 focus:ring-offset-white
      shadow-md
    `.trim(),
    
    danger: `
      bg-danger-gradient text-white shadow-lg shadow-danger-500/25
      hover:shadow-xl hover:shadow-danger-500/30 hover:-translate-y-0.5
      focus:ring-danger-500 focus:ring-offset-white
      active:shadow-lg
    `.trim(),
    
    warning: `
      bg-warning-gradient text-white shadow-lg shadow-warning-500/25
      hover:shadow-xl hover:shadow-warning-500/30 hover:-translate-y-0.5
      focus:ring-warning-500 focus:ring-offset-white
      active:shadow-lg
    `.trim(),
    
    glass: `
      bg-white/10 backdrop-blur-sm text-white border border-white/20
      hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5
      shadow-card hover:shadow-card-hover
      focus:ring-white/50 focus:ring-offset-transparent
    `.trim(),
  };

  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3 text-base gap-2.5',
    xl: 'px-10 py-4 text-lg gap-3',
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    className
  ].filter(Boolean).join(' ');

  const loadingSpinner = (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${
      size === 'xs' ? 'h-3 w-3' :
      size === 'sm' ? 'h-4 w-4' :
      size === 'md' ? 'h-4 w-4' :
      size === 'lg' ? 'h-5 w-5' :
      'h-5 w-5'
    }`} />
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          {loadingSpinner}
          <span className="opacity-75">載入中...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span className="flex-1 text-center">{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;