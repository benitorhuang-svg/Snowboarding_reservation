import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';
import HomePage from '@features/home/pages/HomePage';
import AuthPage from '@features/auth/pages/AuthPage';
import DashboardPage from '@features/profile/pages/DashboardPage';
import CalendarPage from '@features/booking/pages/CalendarPage';
import AdminTranslations from '@features/admin/pages/AdminTranslations';
import EditProfile from '@features/profile/pages/EditProfile';
import PaymentMethods from '@features/profile/pages/PaymentMethods';
import { useAuthStore } from '@features/auth/store/authStore';
import type { User } from '@shared';
import { NotificationProvider } from '@core';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, logout: storeLogout, initAuthListener } = useAuthStore();
  const [wasBooking, setWasBooking] = useState(false);

  // Initialize Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    if (wasBooking) {
      setWasBooking(false);
      navigate('/calendar');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    await storeLogout();
    navigate('/');
  };

  const navigateToBooking = () => {
    if (!user) {
      setWasBooking(true);
      navigate('/auth');
    } else {
      navigate('/calendar');
    }
  };

  return (
    <div className="bg-bg-dark min-h-screen text-white selection:bg-accent-blue/30 overflow-x-hidden scroll-smooth">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onNavigate={navigateToBooking}
              onAuth={() => navigate(user ? '/dashboard' : '/auth')}
              user={user}
            />
          }
        />

        <Route
          path="/calendar"
          element={<CalendarPage onNavigate={() => navigate('/')} />}
        />

        <Route
          path="/auth"
          element={
            <AuthPage onSuccess={handleAuthSuccess} onBack={() => navigate('/')} />
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage
                user={user}
                onLogout={handleLogout}
                onNavigate={() => navigate('/calendar')}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="/edit-profile"
          element={user ? <EditProfile /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/payment-methods"
          element={user ? <PaymentMethods /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/admin/translations"
          element={
            user?.role === 'ADMIN' ? <AdminTranslations /> : <Navigate to="/" replace />
          }
        />
      </Routes>

      {/* Redesigned Back to Top Button */}
      {location.pathname !== '/auth' && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-6 md:right-10 bottom-8 md:bottom-12 w-12 h-12 md:w-14 md:h-14 glass rounded-full flex items-center justify-center group hover:glow-blue active:scale-95 transition-all z-500 shadow-2xl border-border-light"
          title="回到頂端"
        >
          <div className="relative flex flex-col items-center">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-accent-blue group-hover:-translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 15l7-7 7 7"
              ></path>
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
