import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';

const API_BASE = 'http://localhost:5000/api';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
    adminUsername: '',
    adminPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Get redirect path from location state or default
  const from = location.state?.from?.pathname || (loginType === 'admin' ? '/admin' : '/user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginType === 'user') {
        // User login - verify employee ID
        const response = await fetch(`${API_BASE}/user/profile/${formData.employeeId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Verify employee data matches
          if (data.data.employeeId === formData.employeeId) {
            // Store user session using AuthContext
            login({
              type: 'user',
              employeeId: formData.employeeId,
              employee: data.data,
              loggedIn: true
            });
            // Redirect to user panel - shows only this employee's data
            navigate('/user', { replace: true });
          } else {
            setError('Employee ID mismatch. Please try again.');
          }
        } else {
          setError('Employee ID not found. Please check and try again.');
        }
      } else {
        // Admin login - simple password check (in production, use proper auth)
        if (formData.adminUsername === 'admin' && formData.adminPassword === 'admin123') {
          login({
            type: 'admin',
            username: formData.adminUsername,
            loggedIn: true
          });
          navigate('/admin', { replace: true });
        } else {
          setError('Invalid admin credentials. Use: admin / admin123');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Connection error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 text-gray-900">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl" style={{ color: '#111827' }}>Welcome Back</h1>
              <p className="mt-2 text-sm text-gray-600" style={{ color: '#4B5563' }}>Sign in to access your account</p>
            </div>

            {/* Login Type Tabs */}
            <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setLoginType('user');
                  setError('');
                  setFormData({ employeeId: '', password: '', adminUsername: '', adminPassword: '' });
                }}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                  loginType === 'user'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="text-inherit">👤 Employee Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType('admin');
                  setError('');
                  setFormData({ employeeId: '', password: '', adminUsername: '', adminPassword: '' });
                }}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
                  loginType === 'admin'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <span className="text-inherit">🔐 Admin Login</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginType === 'user' ? (
                <>
                  <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>
                      Employee ID <span className="text-red-500" style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="employeeId"
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="e.g., EMP-001"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter your Employee ID to view your profile</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>
                      Admin Username <span className="text-red-500" style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="adminUsername"
                      type="text"
                      required
                      value={formData.adminUsername}
                      onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                      placeholder="Enter admin username"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1" style={{ color: '#374151' }}>
                      Password <span className="text-red-500" style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="adminPassword"
                      type="password"
                      required
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                    <p className="text-xs text-blue-900">
                      <strong>Demo Credentials:</strong> admin / admin123
                    </p>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 text-white">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span className="text-white">Signing in...</span>
                  </span>
                ) : (
                  <span className="text-white">Sign In</span>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500" style={{ color: '#6B7280' }}>
                {loginType === 'user' ? (
                  <>Don't know your Employee ID? Contact your administrator.</>
                ) : (
                  <>Forgot password? Contact system administrator.</>
                )}
              </p>
            </div>
          </div>

          {/* Quick Access Info */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2" style={{ color: '#111827' }}>Quick Access</h3>
            <div className="space-y-2 text-xs text-gray-600" style={{ color: '#4B5563' }}>
              <div className="flex items-center gap-2">
                <span>👤</span>
                <span><strong style={{ color: '#111827' }}>Employee:</strong> Use your Employee ID to view your profile, salary, and allowances</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔐</span>
                <span><strong style={{ color: '#111827' }}>Admin:</strong> Manage employees, expenses, allowances, and process payroll</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

