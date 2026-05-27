import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import DelayPredictionPage from '../pages/DelayPredictionPage';
import DimensionsPage from '../pages/DimensionsPage';
import FlightDataPage from '../pages/FlightDataPage';
import InteractiveMapPage from '../pages/InteractiveMapPage';
import SettingsPage from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'dimensions', element: <DimensionsPage /> },
      { path: 'flights', element: <FlightDataPage /> },
      { path: 'prediction', element: <DelayPredictionPage /> },
      { path: 'map', element: <InteractiveMapPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
