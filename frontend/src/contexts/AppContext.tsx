import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type {
  User,
  WorkoutSession,
  Notification,
  LoadingState,
  UserSettings
} from '../types';

// Define the app state
interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Current workout session
  activeSession: WorkoutSession | null;
  
  // UI state
  notifications: Notification[];
  loading: LoadingState;
  
  // Settings
  settings: UserSettings | null;
  
  // Network status
  isOnline: boolean;
}

// Define action types
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ACTIVE_SESSION'; payload: WorkoutSession | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_LOADING'; payload: { key: string; isLoading: boolean } }
  | { type: 'SET_SETTINGS'; payload: UserSettings }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  activeSession: null,
  notifications: [],
  loading: {},
  settings: null,
  isOnline: navigator.onLine
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };
      
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload
      };
      
    case 'SET_ACTIVE_SESSION':
      return {
        ...state,
        activeSession: action.payload
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
      
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.isLoading
        }
      };
      
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.payload
      };
      
    case 'SET_ONLINE':
      return {
        ...state,
        isOnline: action.payload
      };
      
    case 'RESET_STATE':
      return {
        ...initialState,
        isOnline: state.isOnline
      };
      
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Helper functions
  setUser: (user: User | null) => void;
  setActiveSession: (session: WorkoutSession | null) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  setSettings: (settings: UserSettings) => void;
  logout: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Context provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setActiveSession = (session: WorkoutSession | null) => {
    dispatch({ type: 'SET_ACTIVE_SESSION', payload: session });
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id } });
    
    // Auto-remove notification after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, duration);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const setLoading = (key: string, isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, isLoading } });
  };

  const setSettings = (settings: UserSettings) => {
    dispatch({ type: 'SET_SETTINGS', payload: settings });
  };

  const logout = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  // Listen to online/offline events
  React.useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    setUser,
    setActiveSession,
    addNotification,
    removeNotification,
    setLoading,
    setSettings,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}