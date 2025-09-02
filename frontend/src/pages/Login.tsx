import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import type { LoginForm } from '../types';
// import { Input, Button } from '../components/ui';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<LoginForm>>({});

  const validateForm = (): boolean => {
    const errors: Partial<LoginForm> = {};

    if (!formData.email.trim()) {
      errors.email = '請輸入電子郵件';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '請輸入有效的電子郵件格式';
    }

    if (!formData.password) {
      errors.password = '請輸入密碼';
    } else if (formData.password.length < 6) {
      errors.password = '密碼至少需要 6 個字元';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
    } catch {
      // Error is handled by the context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof LoginForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-emerald-500/20 to-orange-500/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-500/10 to-emerald-500/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Particles/Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-emerald-400/30 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-40 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-40 w-16 h-16 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-lg animate-bounce" style={{ animationDuration: '5s', animationDelay: '3s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Glass Morphism Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transition-all duration-500 hover:bg-white/15 hover:shadow-3xl hover:scale-105">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Modern Logo */}
              <div className="mx-auto h-20 w-20 mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300"></div>
                <div className="relative h-full w-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-2">
                FitnessApp
              </h2>
              <p className="text-emerald-100/80 text-lg font-medium mb-1">
                打造理想體態
              </p>
              <p className="text-white/60 text-sm">
                開始您的健身之旅
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Email Input */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-emerald-200/90 mb-2">
                    電子郵件地址
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-emerald-300/70 group-focus-within:text-emerald-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                      placeholder="輸入您的電子郵件"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-red-300 bg-red-500/10 rounded-lg px-3 py-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-medium text-emerald-200/90 mb-2">
                    密碼
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-emerald-300/70 group-focus-within:text-emerald-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                      placeholder="輸入您的密碼"
                    />
                  </div>
                  {formErrors.password && (
                    <p className="mt-2 text-sm text-red-300 bg-red-500/10 rounded-lg px-3 py-1">{formErrors.password}</p>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-400 focus:ring-emerald-400/50 border-white/30 rounded bg-white/10 backdrop-blur-sm"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-white/80 hover:text-white transition-colors">
                    記住我
                  </label>
                </div>

                <div className="text-sm">
                  <button type="button" className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors duration-200 hover:underline">
                    忘記密碼？
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登入中...
                    </>
                  ) : (
                    <>
                      <span>開始健身之旅</span>
                      <svg className="ml-2 -mr-1 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60 font-medium">健康生活從這裡開始</span>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="text-center pt-4">
                <p className="text-emerald-200/80 text-sm italic">
                  "成功的唯一秘訣是永不放棄"
                </p>
              </div>
            </form>
          </div>

          {/* Bottom Decoration */}
          <div className="mt-8 text-center">
            <p className="text-white/40 text-xs">
              © 2024 FitnessApp. 讓每一次訓練都有意義
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;