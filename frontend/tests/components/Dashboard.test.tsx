import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { jest } from '@jest/globals';
import Dashboard from '../../src/pages/Dashboard';

// 模擬服務
const mockDashboardService = {
  getDashboardData: jest.fn(),
};

const mockWorkoutService = {
  getActiveSession: jest.fn(),
  startWorkoutSession: jest.fn(),
};

jest.mock('../../src/services', () => ({
  dashboardService: mockDashboardService,
  workoutService: mockWorkoutService,
}));

// 模擬上下文
const mockUser = {
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
};

const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
};

const mockAppContext = {
  state: { notifications: [] },
  addNotification: jest.fn(),
  removeNotification: jest.fn(),
  clearNotifications: jest.fn(),
};

jest.mock('../../src/contexts', () => ({
  useAuth: () => mockAuthContext,
  useApp: () => mockAppContext,
}));

// 模擬 useCache Hook
const mockUseCache = jest.fn();
jest.mock('../../src/hooks', () => ({
  useCache: mockUseCache,
}));

// 測試助手函數
const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

// 模擬儀表板數據
const mockDashboardData = {
  weeklyStats: {
    workouts: 4,
    duration: 285,
    exercises: 18,
    volume: 5400,
  },
  recentWorkouts: [
    {
      id: 'workout-1',
      name: '胸部訓練',
      date: '2024-01-15',
      duration: 75,
      exercises: [
        { id: 'ex-1', name: '臥推' },
        { id: 'ex-2', name: '飛鳥' },
      ],
    },
    {
      id: 'workout-2',
      name: '背部訓練',
      date: '2024-01-13',
      duration: 68,
      exercises: [
        { id: 'ex-3', name: '引體向上' },
      ],
    },
  ],
  personalRecords: [
    {
      id: 'pr-1',
      exerciseName: '臥推',
      value: 120,
      type: 'weight',
      date: '2024-01-10',
    },
    {
      id: 'pr-2',
      exerciseName: '深蹲',
      value: 25,
      type: 'reps',
      date: '2024-01-08',
    },
  ],
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 設定預設的 useCache 行為
    mockUseCache.mockReturnValue([
      {
        data: mockDashboardData,
        isLoading: false,
        error: null,
      },
      {
        revalidate: jest.fn(),
      },
    ]);

    // 設定預設的服務行為
    mockWorkoutService.getActiveSession.mockRejectedValue(new Error('No active session'));
    mockDashboardService.getDashboardData.mockResolvedValue(mockDashboardData);
  });

  describe('頁面渲染', () => {
    test('應該正確渲染歡迎信息', () => {
      renderDashboard();

      expect(screen.getByText('歡迎回來，Test User！')).toBeInTheDocument();
      expect(screen.getByText('準備好開始今天的訓練了嗎？')).toBeInTheDocument();
    });

    test('應該顯示當前日期', () => {
      renderDashboard();

      const today = new Date().toLocaleDateString('zh-TW', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      });

      expect(screen.getByText(today)).toBeInTheDocument();
    });

    test('應該渲染週統計卡片', () => {
      renderDashboard();

      expect(screen.getByText('本週訓練')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('本週時長')).toBeInTheDocument();
      expect(screen.getByText('285分鐘')).toBeInTheDocument();
      expect(screen.getByText('本週動作')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('本週訓練量')).toBeInTheDocument();
      expect(screen.getByText('5400kg')).toBeInTheDocument();
    });
  });

  describe('載入狀態', () => {
    test('載入時應該顯示載入器', () => {
      mockUseCache.mockReturnValue([
        {
          data: null,
          isLoading: true,
          error: null,
        },
        {
          revalidate: jest.fn(),
        },
      ]);

      renderDashboard();

      expect(screen.getByRole('status')).toBeInTheDocument(); // LoadingSpinner 應該有 role="status"
    });

    test('錯誤時應該顯示錯誤信息', () => {
      const mockError = new Error('載入失敗');
      const mockRevalidate = jest.fn();
      
      mockUseCache.mockReturnValue([
        {
          data: null,
          isLoading: false,
          error: mockError,
        },
        {
          revalidate: mockRevalidate,
        },
      ]);

      renderDashboard();

      expect(screen.getByText('載入錯誤')).toBeInTheDocument();
      expect(screen.getByText('載入失敗')).toBeInTheDocument();
      
      const retryButton = screen.getByText('重新載入');
      expect(retryButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      expect(mockRevalidate).toHaveBeenCalledTimes(1);
    });
  });

  describe('最近訓練區塊', () => {
    test('應該顯示最近訓練記錄', () => {
      renderDashboard();

      expect(screen.getByText('最近訓練')).toBeInTheDocument();
      expect(screen.getByText('胸部訓練')).toBeInTheDocument();
      expect(screen.getByText('背部訓練')).toBeInTheDocument();
      expect(screen.getByText('2 個動作')).toBeInTheDocument();
      expect(screen.getByText('1 個動作')).toBeInTheDocument();
    });

    test('沒有訓練記錄時應該顯示空狀態', () => {
      mockUseCache.mockReturnValue([
        {
          data: { ...mockDashboardData, recentWorkouts: [] },
          isLoading: false,
          error: null,
        },
        {
          revalidate: jest.fn(),
        },
      ]);

      renderDashboard();

      expect(screen.getByText('還沒有訓練記錄')).toBeInTheDocument();
      expect(screen.getByText('開始第一個訓練')).toBeInTheDocument();
    });

    test('應該有查看全部連結', () => {
      renderDashboard();

      const viewAllLink = screen.getByText('查看全部');
      expect(viewAllLink.closest('a')).toHaveAttribute('href', '/workouts');
    });
  });

  describe('個人記錄區塊', () => {
    test('應該顯示個人記錄', () => {
      renderDashboard();

      expect(screen.getByText('個人記錄')).toBeInTheDocument();
      expect(screen.getByText('臥推')).toBeInTheDocument();
      expect(screen.getByText('120kg')).toBeInTheDocument();
      expect(screen.getByText('最大重量')).toBeInTheDocument();
      expect(screen.getByText('深蹲')).toBeInTheDocument();
      expect(screen.getByText('25次')).toBeInTheDocument();
      expect(screen.getByText('最多次數')).toBeInTheDocument();
    });

    test('沒有個人記錄時應該顯示空狀態', () => {
      mockUseCache.mockReturnValue([
        {
          data: { ...mockDashboardData, personalRecords: [] },
          isLoading: false,
          error: null,
        },
        {
          revalidate: jest.fn(),
        },
      ]);

      renderDashboard();

      expect(screen.getByText('開始訓練來創造您的第一個記錄！')).toBeInTheDocument();
    });
  });

  describe('活動訓練', () => {
    test('有活動訓練時應該顯示警告框', async () => {
      const mockActiveSession = {
        id: 'session-1',
        name: '胸部訓練',
        startTime: new Date().toISOString(),
      };

      mockWorkoutService.getActiveSession.mockResolvedValue(mockActiveSession);

      renderDashboard();

      await waitFor(() => {
        expect(screen.getByText('進行中的訓練')).toBeInTheDocument();
        expect(screen.getByText('胸部訓練')).toBeInTheDocument();
        expect(screen.getByText('繼續訓練')).toBeInTheDocument();
      });

      expect(mockAppContext.addNotification).toHaveBeenCalledWith({
        type: 'info',
        message: '您有一個進行中的訓練：胸部訓練',
        duration: 8000,
      });
    });

    test('沒有活動訓練時應該顯示開始訓練按鈕', () => {
      renderDashboard();

      expect(screen.getByText('開始訓練')).toBeInTheDocument();
      expect(screen.getByText('立即開始新的訓練')).toBeInTheDocument();
    });
  });

  describe('快速操作', () => {
    test('應該顯示所有快速操作卡片', () => {
      renderDashboard();

      expect(screen.getByText('開始訓練')).toBeInTheDocument();
      expect(screen.getByText('動作庫')).toBeInTheDocument();
      expect(screen.getByText('訓練範本')).toBeInTheDocument();
    });

    test('點擊開始訓練應該創建新的訓練會話', async () => {
      const user = userEvent.setup();
      const mockSession = {
        id: 'new-session-id',
        name: '快速訓練 - 2024/1/15',
        startTime: new Date().toISOString(),
      };

      mockWorkoutService.startWorkoutSession.mockResolvedValue(mockSession);

      renderDashboard();

      const startWorkoutButton = screen.getByText('開始訓練');
      await user.click(startWorkoutButton);

      await waitFor(() => {
        expect(mockWorkoutService.startWorkoutSession).toHaveBeenCalledWith(
          expect.stringContaining('快速訓練')
        );
      });

      expect(mockAppContext.addNotification).toHaveBeenCalledWith({
        type: 'success',
        message: '開始新的訓練！',
      });
    });

    test('開始訓練失敗時應該顯示錯誤通知', async () => {
      const user = userEvent.setup();
      mockWorkoutService.startWorkoutSession.mockRejectedValue(new Error('創建失敗'));

      renderDashboard();

      const startWorkoutButton = screen.getByText('開始訓練');
      await user.click(startWorkoutButton);

      await waitFor(() => {
        expect(mockAppContext.addNotification).toHaveBeenCalledWith({
          type: 'error',
          message: '無法開始訓練，請稍後再試',
        });
      });
    });

    test('快速操作連結應該正確設置', () => {
      renderDashboard();

      const exerciseLibraryLink = screen.getByText('動作庫').closest('a');
      expect(exerciseLibraryLink).toHaveAttribute('href', '/exercises');

      const templatesLink = screen.getByText('訓練範本').closest('a');
      expect(templatesLink).toHaveAttribute('href', '/templates');
    });
  });

  describe('響應式設計', () => {
    test('應該在移動設備上隱藏日期顯示', () => {
      // 模擬移動設備視窗
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      renderDashboard();

      const dateElement = screen.getByText('今天是').closest('div');
      expect(dateElement).toHaveClass('hidden', 'md:block');
    });
  });

  describe('數據格式化', () => {
    test('應該正確格式化時長', () => {
      renderDashboard();

      // 285 分鐘應該四捨五入顯示為 285
      expect(screen.getByText('285分鐘')).toBeInTheDocument();
    });

    test('應該正確格式化重量', () => {
      renderDashboard();

      // 5400 應該顯示為 5400kg
      expect(screen.getByText('5400kg')).toBeInTheDocument();
    });

    test('應該正確格式化日期', () => {
      renderDashboard();

      // 檢查日期格式化
      expect(screen.getByText('2024/1/15')).toBeInTheDocument();
      expect(screen.getByText('2024/1/13')).toBeInTheDocument();
    });
  });
});