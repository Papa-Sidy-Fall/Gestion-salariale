import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import PayRuns from './pages/PayRuns';
import Payments from './pages/Payments';
import Companies from './pages/Companies';
import Attendances from './pages/Attendances';
import './App.css';
import Layout from './components/Layout'; // Import du composant Layout

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <Layout><Employees /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payruns"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <Layout><PayRuns /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute allowedRoles={['CAISSIER', 'ADMIN', 'SUPER_ADMIN']}>
                  <Layout><Payments /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendances"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <Layout><Attendances /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <Layout><Companies /></Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si des rôles sont spécifiés, vérifier que l'utilisateur a le bon rôle
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default App;
