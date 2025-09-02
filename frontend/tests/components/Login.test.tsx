import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { jest } from '@jest/globals';
import Login from '../../src/pages/Login';
import { AuthProvider } from '../../src/contexts/AuthContext';

// 模擬導航
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 模擬認證上下文
const mockLogin = jest.fn();
const mockAuthContextValue = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: mockLogin,
  logout: jest.fn(),
  register: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
};

jest.mock('../../src/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockAuthContextValue,
}));

// 測試助手函數
const renderLogin = () => {
  
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthContextValue.isLoading = false;
  });

  describe('頁面渲染', () => {
    test('應該正確渲染登入頁面', () => {
      renderLogin();

      expect(screen.getByText('登入您的帳戶')).toBeInTheDocument();
      expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
      expect(screen.getByLabelText('密碼')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '登入' })).toBeInTheDocument();
      expect(screen.getByText('還沒有帳戶嗎？')).toBeInTheDocument();
      expect(screen.getByText('立即註冊')).toBeInTheDocument();
    });

    test('應該渲染記住我選項和忘記密碼連結', () => {
      renderLogin();

      expect(screen.getByLabelText('記住我')).toBeInTheDocument();
      expect(screen.getByText('忘記密碼？')).toBeInTheDocument();
    });

    test('應該渲染註冊按鈕', () => {
      renderLogin();

      expect(screen.getByRole('button', { name: '建立新帳戶' })).toBeInTheDocument();
    });
  });

  describe('表單驗證', () => {
    test('應該顯示必填欄位錯誤', async () => {
      const user = userEvent.setup();
      renderLogin();

      const submitButton = screen.getByRole('button', { name: '登入' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('請輸入電子郵件')).toBeInTheDocument();
        expect(screen.getByText('請輸入密碼')).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });

    test('應該驗證電子郵件格式', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('請輸入有效的電子郵件格式')).toBeInTheDocument();
      });
    });

    test('應該驗證密碼長度', async () => {
      const user = userEvent.setup();
      renderLogin();

      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(passwordInput, '123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('密碼至少需要 6 個字元')).toBeInTheDocument();
      });
    });

    test('輸入時應該清除欄位錯誤', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByLabelText('電子郵件');
      const submitButton = screen.getByRole('button', { name: '登入' });

      // 先觸發錯誤
      await user.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('請輸入電子郵件')).toBeInTheDocument();
      });

      // 輸入內容應該清除錯誤
      await user.type(emailInput, 'test@example.com');
      expect(screen.queryByText('請輸入電子郵件')).not.toBeInTheDocument();
    });
  });

  describe('表單提交', () => {
    test('應該成功提交有效表單', async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({ success: true });
      renderLogin();

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    test('應該處理登入錯誤', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error('登入失敗'));
      renderLogin();

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');
      const submitButton = screen.getByRole('button', { name: '登入' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // 導航不應該被調用
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('載入狀態', () => {
    test('載入時應該顯示載入按鈕', () => {
      renderLogin({ isLoading: true });

      const submitButton = screen.getByRole('button', { name: '登入' });
      expect(submitButton).toBeDisabled();
    });

    test('載入完成後應該啟用按鈕', () => {
      renderLogin({ isLoading: false });

      const submitButton = screen.getByRole('button', { name: '登入' });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('導航連結', () => {
    test('註冊連結應該正確設置', () => {
      renderLogin();

      const registerLink = screen.getByText('立即註冊');
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });

    test('建立新帳戶按鈕應該連結到註冊頁面', () => {
      renderLogin();

      const createAccountButton = screen.getByRole('button', { name: '建立新帳戶' });
      expect(createAccountButton.closest('a')).toHaveAttribute('href', '/register');
    });
  });

  describe('使用者互動', () => {
    test('應該能夠勾選記住我選項', async () => {
      const user = userEvent.setup();
      renderLogin();

      const rememberMeCheckbox = screen.getByLabelText('記住我');
      expect(rememberMeCheckbox).not.toBeChecked();

      await user.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();
    });

    test('應該能夠輸入表單資料', async () => {
      const user = userEvent.setup();
      renderLogin();

      const emailInput = screen.getByLabelText('電子郵件') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('密碼') as HTMLInputElement;

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('無障礙測試', () => {
    test('表單應該有正確的標籤', () => {
      renderLogin();

      expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
      expect(screen.getByLabelText('密碼')).toBeInTheDocument();
      expect(screen.getByLabelText('記住我')).toBeInTheDocument();
    });

    test('輸入欄位應該有正確的屬性', () => {
      renderLogin();

      const emailInput = screen.getByLabelText('電子郵件');
      const passwordInput = screen.getByLabelText('密碼');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('autoComplete', 'email');
      expect(emailInput).toHaveAttribute('required');

      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
      expect(passwordInput).toHaveAttribute('required');
    });
  });
});