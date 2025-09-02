import React, { useState, useEffect, useRef } from 'react';

interface RestTimerProps {
  duration: number;
  exerciseName: string;
  onComplete: () => void;
  onSkip: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ duration, exerciseName, onComplete, onSkip }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft, onComplete]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const addTime = (seconds: number) => {
    setTimeLeft(prev => prev + seconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-600';
    if (timeLeft <= 30) return 'text-orange-600';
    return 'text-blue-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        {/* 標題 */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">⏱️ 組間休息</h3>
          <p className="text-gray-600">{exerciseName}</p>
        </div>

        {/* 進度條 */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            {Math.round(getProgressPercentage())}% 完成
          </div>
        </div>

        {/* 倒數計時器 */}
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-gray-500 mt-2">
            {isPaused ? '⏸️ 已暫停' : '⏰ 倒數中...'}
          </div>
        </div>

        {/* 控制按鈕 */}
        <div className="space-y-4">
          {/* 時間調整 */}
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => addTime(-15)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              disabled={timeLeft <= 15}
            >
              -15s
            </button>
            <button
              onClick={() => addTime(15)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              +15s
            </button>
            <button
              onClick={() => addTime(30)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              +30s
            </button>
          </div>

          {/* 主要控制 */}
          <div className="flex space-x-3">
            <button
              onClick={togglePause}
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                isPaused 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {isPaused ? '▶️ 繼續' : '⏸️ 暫停'}
            </button>
            <button
              onClick={onSkip}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              ⏭️ 跳過
            </button>
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          💡 適當的休息有助於下一組的表現
        </div>
      </div>
    </div>
  );
};

export default RestTimer;