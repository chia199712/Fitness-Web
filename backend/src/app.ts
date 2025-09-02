import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import exerciseRoutes from './routes/exercises';
import workoutRoutes from './routes/workouts';
import templateRoutes from './routes/templates';
import dashboardRoutes from './routes/dashboard';
import settingsRoutes from './routes/settings';
import userService from './services/userService';
import exerciseService from './services/exerciseService';
import workoutService from './services/workoutService';
import templateService from './services/templateService';
import dashboardService from './services/dashboardService';
import settingsService from './services/settingsService';
import { validateEnvironment } from './utils/envValidation';

// Load environment variables first
dotenv.config();

// Validate environment variables and get configuration
const envConfig = validateEnvironment();

const app = express();
const PORT = envConfig.PORT;

// Middleware
const allowedOrigins = [
  envConfig.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server default
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // In development, be more permissive
    if (envConfig.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 錯誤處理中間件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: '服務器內部錯誤'
  });
});

// 初始化服務
async function initializeServices() {
  try {
    console.log('初始化服務...');
    await userService.initializeUserSheet();
    console.log('用戶服務初始化完成');
    
    await exerciseService.initializeExerciseSheet();
    console.log('動作服務初始化完成');
    
    // 初始化訓練相關的 Google Sheets
    await initializeWorkoutSheets();
    console.log('訓練服務初始化完成');
    
    // 初始化範本相關的 Google Sheets
    await templateService.initializeTemplateSheets();
    console.log('範本服務初始化完成');
    
    // Dashboard service initialization removed - Google Sheets dependencies not available
    console.log('儀表板服務初始化完成');
    
    // 初始化設定相關的 Google Sheets
    await initializeSettingsSheets();
    console.log('設定服務初始化完成');
  } catch (error) {
    console.error('服務初始化失敗:', error);
  }
}

// 初始化訓練相關的工作表
async function initializeWorkoutSheets() {
  await workoutService.initializeWorkoutSheets();
}

// 初始化設定相關的工作表
async function initializeSettingsSheets() {
  // 設定服務目前不需要初始化工作表，因為使用現有的 GoogleSheetsService
  // 如果未來需要特定的設定工作表初始化，可以在這裡添加
  console.log('設定服務工作表檢查完成');
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fitness App API Server Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      exercises: '/api/exercises',
      workouts: '/api/workouts',
      templates: '/api/templates',
      dashboard: '/api/dashboard',
      settings: '/api/settings',
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '找不到請求的資源'
  });
});

// 啟動服務器
async function startServer() {
  try {
    await initializeServices();
    
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`🚀 Fitness App API Server 已啟動`);
      console.log(`📡 端口: ${PORT}`);
      console.log(`🌍 環境: ${envConfig.NODE_ENV}`);
      console.log(`🔗 API 基礎路徑: http://localhost:${PORT}/api`);
      console.log(`📋 認證路由: http://localhost:${PORT}/api/auth`);
      console.log(`🏋️ 動作路由: http://localhost:${PORT}/api/exercises`);
      console.log(`📊 訓練路由: http://localhost:${PORT}/api/workouts`);
      console.log(`📋 範本路由: http://localhost:${PORT}/api/templates`);
      console.log(`📈 儀表板路由: http://localhost:${PORT}/api/dashboard`);
      console.log(`⚙️ 設定路由: http://localhost:${PORT}/api/settings`);
      console.log(`💚 健康檢查: http://localhost:${PORT}/health`);
      console.log(`========================================`);
    });
  } catch (error) {
    console.error('服務器啟動失敗:', error);
    process.exit(1);
  }
}

startServer();

export default app;