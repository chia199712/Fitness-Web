import React, { useState } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helpText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  className = '',
  id,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseClasses = `
    w-full transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-gray-400
  `.trim();

  const variantClasses = {
    default: `
      bg-white border-2 border-gray-200
      hover:border-gray-300
      focus:border-fitness-500 focus:ring-fitness-500/20
      ${error 
        ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/20' 
        : ''
      }
    `.trim(),
    
    glass: `
      bg-white/90 backdrop-blur-sm border border-white/20
      hover:bg-white/95 hover:border-white/30
      focus:border-fitness-400 focus:ring-fitness-400/20
      ${error 
        ? 'border-danger-300/50 focus:border-danger-400 focus:ring-danger-400/20' 
        : ''
      }
    `.trim(),
    
    filled: `
      bg-gray-100 border-2 border-transparent
      hover:bg-gray-50
      focus:bg-white focus:border-fitness-500 focus:ring-fitness-500/20
      ${error 
        ? 'bg-danger-50 focus:border-danger-500 focus:ring-danger-500/20' 
        : ''
      }
    `.trim(),
  };

  const sizeClasses = {
    sm: `px-3 py-2 text-sm ${leftIcon || rightIcon ? 'pl-10' : ''}`,
    md: `px-4 py-3 text-sm ${leftIcon || rightIcon ? 'pl-12' : ''}`,
    lg: `px-5 py-4 text-base ${leftIcon || rightIcon ? 'pl-14' : ''}`,
  };

  const labelClasses = error 
    ? 'text-danger-700 font-medium' 
    : 'text-slate-700 font-medium';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    'rounded-xl',
    className
  ].filter(Boolean).join(' ');

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const passwordToggleIcon = showPassword ? (
    <svg className={iconSize[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  ) : (
    <svg className={iconSize[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium transition-colors duration-200 ${labelClasses}`}
        >
          {label}
          {props.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
            size === 'sm' ? 'left-3' : size === 'md' ? 'left-4' : 'left-5'
          }`}>
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          className={classes}
          {...props}
        />

        {(rightIcon || isPassword) && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            size === 'sm' ? 'right-3' : size === 'md' ? 'right-4' : 'right-5'
          }`}>
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                tabIndex={-1}
              >
                {passwordToggleIcon}
              </button>
            ) : (
              <div className="text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-danger-600">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium animate-slide-up">{error}</p>
        </div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500 flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{helpText}</span>
        </p>
      )}
    </div>
  );
};

export default Input;