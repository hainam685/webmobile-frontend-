/**
 * App Layout Component - Refactored
 * Main layout wrapper with improved error handling and initialization
 */

import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './navBar/navBar.jsx';
import FooterSection from './footerSection/footerSection.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import { loadCart } from '../store/cart.js';
import { authService } from '../services/authService';
import '../css/applayout.css';

/**
 * App Layout Component
 * Manages main application layout with error boundaries
 */
const AppLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const profile = useSelector((state) => state.profile?.Profile);
  const initializationRef = useCallback(() => null, []);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check token expiration
        if (!authService.hasValidToken()) {
          return;
        }

        // Load cart if user is authenticated
        dispatch(loadCart());
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    // Only initialize once per session
    initializeApp();
  }, [dispatch]);

  // Handle auth:unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('User unauthorized - redirecting to login');
      window.location.href = '/admin-login';
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // Handle auth:logout event
  useEffect(() => {
    const handleLogout = () => {
      // Clear state
      dispatch(loadCart());
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="layout" key={location.pathname}>
        <header className="header" role="banner">
          <span className="hotline-info">
            📞 Hotline: 0332651691 - 0366336842
          </span>
        </header>

        <NavBar profile={profile} />

        <main className="main-content" role="main">
          <Outlet />
        </main>

        <FooterSection />
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;
