import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService, exerciseService } from '../services';
import { useApp } from '../contexts';
import { useTimer, formatTime } from '../hooks';
import type { WorkoutSession, Exercise, ExerciseSet } from '../types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Input, 
  Modal,
  LoadingSpinner,
  ConfirmDialog 
} from '../components/ui';

const ActiveWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  
  // Workout session state
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Exercise selection modal
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState('');
  
  // Rest timer state
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(90); // Default 90 seconds
  
  // Rest timer
  const [restTimerState, restTimerControls] = useTimer({
    initialTime: restDuration,
    countdown: true,
    onComplete: () => {
      setShowRestTimer(false);
      addNotification({
        type: 'success',
        message: '休息時間結束！準備下一組！'
      });
    }
  });

  // Workout timer (total workout time)
  const [workoutTimerState, workoutTimerControls] = useTimer({
    autoStart: true
  });

  // Confirmation dialogs
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');

  const loadActiveSession = useCallback(async () => {
    try {
      const activeSession = await workoutService.getActiveSession();
      if (!activeSession) {
        addNotification({
          type: 'warning',
          message: '沒有進行中的訓練'
        });
        navigate('/dashboard');
        return;
      }
      setSession(activeSession);
    } catch {
      addNotification({
        type: 'error',
        message: '無法載入訓練'
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [addNotification, navigate]);

  useEffect(() => {
    loadActiveSession();
    loadExercises();
  }, [loadActiveSession]);

  const loadExercises = async () => {
    try {
      const exerciseList = await exerciseService.getAllExercises();
      setExercises(exerciseList);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  };

  const addExerciseToWorkout = async (exerciseId: string) => {
    if (!session) return;
    
    try {
      setSaving(true);
      const updatedSession = await workoutService.addExerciseToSession(session.id, exerciseId);
      setSession(updatedSession);
      setShowExerciseModal(false);
      addNotification({
        type: 'success',
        message: '動作已新增'
      });
    } catch {
      addNotification({
        type: 'error',
        message: '新增動作失敗'
      });
    } finally {
      setSaving(false);
    }
  };

  const addSet = async (exerciseId: string) => {
    if (!session) return;

    const setData: Omit<ExerciseSet, 'id'> = {
      reps: 0,
      weight: 0,
      restTime: restDuration
    };

    try {
      setSaving(true);
      const updatedSession = await workoutService.addSetToExercise(session.id, exerciseId, setData);
      setSession(updatedSession);
    } catch {
      addNotification({
        type: 'error',
        message: '新增組數失敗'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSet = async (exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => {
    if (!session) return;

    try {
      const updatedSession = await workoutService.updateSet(session.id, exerciseId, setId, updates);
      setSession(updatedSession);
    } catch {
      addNotification({
        type: 'error',
        message: '更新組數失敗'
      });
    }
  };

  const completeSet = async (exerciseId: string, setId: string) => {
    await updateSet(exerciseId, setId, { completed: true });
    
    // Start rest timer automatically
    setRestDuration(restDuration);
    restTimerControls.reset();
    restTimerControls.start();
    setShowRestTimer(true);
  };

  const deleteSet = async (exerciseId: string, setId: string) => {
    if (!session) return;

    try {
      setSaving(true);
      const updatedSession = await workoutService.deleteSet(session.id, exerciseId, setId);
      setSession(updatedSession);
    } catch {
      addNotification({
        type: 'error',
        message: '刪除組數失敗'
      });
    } finally {
      setSaving(false);
    }
  };

  const finishWorkout = async () => {
    if (!session) return;

    try {
      setSaving(true);
      workoutTimerControls.stop();
      await workoutService.finishWorkoutSession(session.id, workoutNotes);
      addNotification({
        type: 'success',
        message: '訓練完成！'
      });
      navigate('/dashboard');
    } catch {
      addNotification({
        type: 'error',
        message: '完成訓練失敗'
      });
    } finally {
      setSaving(false);
      setShowFinishDialog(false);
    }
  };

  const cancelWorkout = async () => {
    if (!session) return;

    try {
      setSaving(true);
      await workoutService.cancelWorkoutSession(session.id);
      addNotification({
        type: 'info',
        message: '訓練已取消'
      });
      navigate('/dashboard');
    } catch {
      addNotification({
        type: 'error',
        message: '取消訓練失敗'
      });
    } finally {
      setSaving(false);
      setShowCancelDialog(false);
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    exercise.category.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>總時長: {formatTime(workoutTimerState.time)}</span>
                <span>動作: {session.exercises.length}</span>
                <span>總組數: {session.exercises.reduce((total, ex) => total + ex.sets.length, 0)}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setShowCancelDialog(true)}
                disabled={saving}
              >
                取消訓練
              </Button>
              <Button
                onClick={() => setShowFinishDialog(true)}
                disabled={saving}
              >
                完成訓練
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rest Timer */}
      {showRestTimer && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">休息計時</h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatTime(restTimerState.time)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {restTimerState.isPaused ? (
                  <Button size="sm" onClick={restTimerControls.resume}>
                    繼續
                  </Button>
                ) : (
                  <Button size="sm" onClick={restTimerControls.pause}>
                    暫停
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => {
                    restTimerControls.stop();
                    setShowRestTimer(false);
                  }}
                >
                  跳過
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise List */}
      <div className="space-y-4">
        {session.exercises.map((workoutExercise) => (
          <Card key={workoutExercise.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{workoutExercise.exercise.name}</span>
                <Button
                  size="sm"
                  onClick={() => addSet(workoutExercise.exerciseId)}
                  disabled={saving}
                >
                  新增組數
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workoutExercise.sets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    點擊「新增組數」開始這個動作
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">組數</th>
                          <th className="text-left p-2">上次</th>
                          <th className="text-left p-2">重量 (kg)</th>
                          <th className="text-left p-2">次數</th>
                          <th className="text-left p-2">完成</th>
                          <th className="text-left p-2">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workoutExercise.sets.map((set, setIndex) => (
                          <tr key={set.id} className="border-b">
                            <td className="p-2 font-medium">{setIndex + 1}</td>
                            <td className="p-2 text-gray-500">
                              {/* TODO: 顯示上次的數據 */}
                              -
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                value={set.weight || ''}
                                onChange={(e) => updateSet(
                                  workoutExercise.exerciseId,
                                  set.id,
                                  { weight: parseFloat(e.target.value) || 0 }
                                )}
                                className="w-20"
                                min="0"
                                step="0.5"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                value={set.reps || ''}
                                onChange={(e) => updateSet(
                                  workoutExercise.exerciseId,
                                  set.id,
                                  { reps: parseInt(e.target.value) || 0 }
                                )}
                                className="w-20"
                                min="0"
                              />
                            </td>
                            <td className="p-2">
                              {set.completed ? (
                                <div className="text-green-600">✓</div>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => completeSet(workoutExercise.exerciseId, set.id)}
                                  disabled={!set.weight || !set.reps}
                                >
                                  完成
                                </Button>
                              )}
                            </td>
                            <td className="p-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => deleteSet(workoutExercise.exerciseId, set.id)}
                              >
                                刪除
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Exercise Button */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-300"
          onClick={() => setShowExerciseModal(true)}
        >
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">新增動作</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Selection Modal */}
      <Modal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        title="選擇動作"
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="搜尋動作..."
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value)}
          />
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => addExerciseToWorkout(exercise.id)}
              >
                <h4 className="font-medium">{exercise.name}</h4>
                <p className="text-sm text-gray-500">{exercise.category}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Finish Workout Confirmation */}
      <ConfirmDialog
        isOpen={showFinishDialog}
        onClose={() => setShowFinishDialog(false)}
        onConfirm={finishWorkout}
        title="完成訓練"
        message="確定要完成這次訓練嗎？"
        confirmText="完成"
        loading={saving}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            訓練筆記 (可選)
          </label>
          <textarea
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            placeholder="記錄今天的訓練感受..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </ConfirmDialog>

      {/* Cancel Workout Confirmation */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={cancelWorkout}
        title="取消訓練"
        message="確定要取消這次訓練嗎？所有數據將會丟失。"
        confirmText="取消訓練"
        loading={saving}
        variant="danger"
      />
    </div>
  );
};

export default ActiveWorkout;