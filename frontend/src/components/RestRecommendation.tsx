import React from 'react';

interface RestRecommendationProps {
  exerciseName: string;
  muscleGroups: string[];
  weight: number;
  reps: number;
  previousRestTime?: number;
}

const RestRecommendation: React.FC<RestRecommendationProps> = ({
  exerciseName,
  muscleGroups,
  reps,
  previousRestTime
}) => {
  
  const getRecommendedRestTime = () => {
    // 根據動作類型、重量、次數推薦休息時間
    const isCompoundMovement = muscleGroups.length >= 3;
    const isHeavyWeight = reps <= 6;
    const isModerateWeight = reps >= 7 && reps <= 12;
    // const isLightWeight = reps > 12;

    // 複合動作需要更長休息時間
    if (isCompoundMovement) {
      if (isHeavyWeight) return { min: 180, max: 300, reason: '大重量複合動作' };
      if (isModerateWeight) return { min: 120, max: 180, reason: '中重量複合動作' };
      return { min: 90, max: 120, reason: '輕重量複合動作' };
    }

    // 單關節動作
    if (isHeavyWeight) return { min: 120, max: 180, reason: '大重量單關節動作' };
    if (isModerateWeight) return { min: 60, max: 90, reason: '肌肥大訓練' };
    return { min: 30, max: 60, reason: '肌耐力訓練' };
  };

  const recommendation = getRecommendedRestTime();
  const avgRest = Math.round((recommendation.min + recommendation.max) / 2);

  const getEfficiencyFeedback = () => {
    if (!previousRestTime) return null;
    
    const isOptimal = previousRestTime >= recommendation.min && previousRestTime <= recommendation.max;
    const isTooShort = previousRestTime < recommendation.min;
    const isTooLong = previousRestTime > recommendation.max;

    if (isOptimal) {
      return {
        type: 'success',
        message: '上次休息時間很理想！',
        icon: '✅'
      };
    } else if (isTooShort) {
      return {
        type: 'warning',
        message: '上次休息可能太短，可能影響下組表現',
        icon: '⚠️'
      };
    } else if (isTooLong) {
      return {
        type: 'info',
        message: '上次休息較長，可考慮縮短以提高效率',
        icon: 'ℹ️'
      };
    }
    return null;
  };

  const feedback = getEfficiencyFeedback();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">⏱️</span>
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-blue-900">
            🎯 建議休息時間
          </h4>
          
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {recommendation.reason}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {avgRest}秒
              </span>
            </div>
            
            <div className="text-xs text-blue-700">
              建議範圍：{recommendation.min}-{recommendation.max}秒
            </div>

            {/* 快速設定按鈕 */}
            <div className="flex space-x-2 mt-3">
              <button
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                onClick={() => {/* 設定為建議時間的邏輯 */}}
              >
                使用 {avgRest}s
              </button>
              <button
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                onClick={() => {/* 設定為最小時間的邏輯 */}}
              >
                快速 {recommendation.min}s
              </button>
              <button
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                onClick={() => {/* 設定為最大時間的邏輯 */}}
              >
                充分 {recommendation.max}s
              </button>
            </div>
          </div>

          {/* 上次休息時間反饋 */}
          {feedback && (
            <div className={`mt-3 p-2 rounded text-xs ${
              feedback.type === 'success' ? 'bg-green-100 text-green-800' :
              feedback.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <span className="mr-1">{feedback.icon}</span>
              {feedback.message}
              {previousRestTime && (
                <span className="ml-1 font-medium">
                  (上次: {previousRestTime}秒)
                </span>
              )}
            </div>
          )}

          {/* 個性化建議 */}
          <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
            <div className="font-medium mb-1">💡 個性化提示</div>
            <div className="space-y-1">
              {muscleGroups.includes('legs') && (
                <div>• 腿部訓練建議多休息15-30秒</div>
              )}
              {exerciseName.includes('硬舉') || exerciseName.includes('深蹲') && (
                <div>• 大型複合動作需要充分恢復</div>
              )}
              {reps > 15 && (
                <div>• 高次數訓練可適當縮短休息</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestRecommendation;