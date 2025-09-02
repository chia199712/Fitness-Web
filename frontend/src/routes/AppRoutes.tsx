import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components';
import {
  Dashboard,
  Login,
  WorkoutLog,
  // ActiveWorkout,
  ExerciseLibrary,
  Templates,
  Settings,
  Analytics,
  QuickWorkout,
} from '../pages';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <Layout>
          <Navigate to="/dashboard" replace />
        </Layout>
      } />
      
      <Route path="/dashboard" element={
        <Layout>
          <Dashboard />
        </Layout>
      } />
      
      <Route path="/workouts" element={
        <Layout>
          <WorkoutLog />
        </Layout>
      } />
      
      <Route path="/workout" element={
        <Layout>
          <QuickWorkout />
        </Layout>
      } />
      
      <Route path="/exercises" element={
        <Layout>
          <ExerciseLibrary />
        </Layout>
      } />
      
      <Route path="/templates" element={
        <Layout>
          <Templates />
        </Layout>
      } />
      
      <Route path="/settings" element={
        <Layout>
          <Settings />
        </Layout>
      } />
      
      <Route path="/analytics" element={
        <Layout>
          <Analytics />
        </Layout>
      } />
      
      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={
        <Layout>
          <Navigate to="/dashboard" replace />
        </Layout>
      } />
    </Routes>
  );
};

export default AppRoutes;