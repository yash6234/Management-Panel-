import { Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from '../pages/Login/auth';

import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/Login/Login';
import DashboardHome from '../pages/DashboardHome/DashboardHome';
import Masters from '../pages/Master/Masters';
import Sales from '../pages/Sales/Sales';
import Data from '../pages/Data/Data';


/* 🔐 Route Guard */
function ProtectedRoute({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

 function AppRoutes() {
  const isLoggedIn = !!getToken();

  return (
    <Routes>
      {/* ✅ LOGIN */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* ✅ DASHBOARD + NESTED ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="masters" element={<Masters />} />
        <Route path="sales" element={<Sales />} />
        <Route path="data" element={<Data />} />
      </Route>

      {/* ✅ DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
export default AppRoutes;