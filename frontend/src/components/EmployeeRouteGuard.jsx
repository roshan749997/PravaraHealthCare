import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Component to redirect employees away from pages they shouldn't access
export default function EmployeeRouteGuard({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // If user is logged in as employee (not admin), redirect to their profile
    if (isAuthenticated() && !isAdmin()) {
      navigate('/user', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // If employee is logged in, don't render the page (will redirect)
  if (isAuthenticated() && !isAdmin()) {
    return null;
  }

  return children;
}

