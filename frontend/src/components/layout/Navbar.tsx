import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { 
      path: '/dashboard', 
      label: '儀表板', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      path: '/workouts', 
      label: '訓練記錄', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      path: '/exercises', 
      label: '動作庫', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
        </svg>
      )
    },
    { 
      path: '/templates', 
      label: '訓練範本', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      path: '/analytics', 
      label: '數據分析', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      path: '/settings', 
      label: '設定', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-fitness-200/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Enhanced Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="h-10 w-10 bg-fitness-gradient rounded-xl flex items-center justify-center shadow-fitness group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-glow">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-xl bg-fitness-400 opacity-75 animate-ping"></div>
              </div>
              <div>
                <span className="text-2xl font-display font-bold text-gradient group-hover:scale-105 transition-transform duration-300">FitnessApp</span>
                <div className="text-xs text-slate-500 font-medium tracking-wide">您的健身夥伴</div>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-white bg-fitness-gradient shadow-fitness transform scale-105'
                    : 'text-slate-600 hover:text-fitness-600 hover:bg-fitness-50 hover:scale-105 hover:shadow-md'
                }`}
              >
                <span className={`transition-transform duration-300 ${
                  isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-fitness-600 group-hover:scale-110'
                }`}>
                  {item.icon}
                </span>
                <span className="relative">
                  {item.label}
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"></div>
                  )}
                </span>
              </Link>
            ))}
            
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group relative inline-flex items-center justify-center p-3 rounded-xl bg-fitness-50 text-fitness-600 hover:bg-fitness-100 focus:outline-none focus:ring-2 focus:ring-fitness-500 focus:ring-offset-2 transition-all duration-300 hover:scale-110"
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative">
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6 transform rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-br from-white via-fitness-50 to-success-50 backdrop-blur-xl border-t border-fitness-200/30">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center space-x-4 px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300 animate-slide-up ${
                  isActive(item.path)
                    ? 'text-white bg-fitness-gradient shadow-fitness scale-105'
                    : 'text-slate-700 hover:text-fitness-600 hover:bg-white hover:shadow-md hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'bg-white/20 text-white' 
                    : 'bg-fitness-100 text-fitness-600 group-hover:bg-fitness-200 group-hover:scale-110'
                }`}>
                  {item.icon}
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive(item.path) && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;