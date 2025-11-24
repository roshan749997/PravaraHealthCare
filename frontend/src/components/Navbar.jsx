import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const allNavLinks = [
  { label: "Dashboard", to: "/", public: true, hideForEmployees: true },
  { label: "Employees", to: "/employees", public: true, hideForEmployees: true },
  { label: "Payroll", to: "/payroll", public: true, hideForEmployees: true },
  { label: "Total Salaries", to: "/total-salaries", public: true, hideForEmployees: true },
  { label: "Other Expenses", to: "/other-expenses", public: true, hideForEmployees: true },
  { label: "Financial Analytics", to: "/financial-analytics", public: true, hideForEmployees: true },
  { label: "Admin Panel", to: "/admin", adminOnly: true },
  { label: "My Profile", to: "/user", userOnly: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const navLinks = useMemo(() => {
    return allNavLinks.filter(link => {
      // Hide links for employees if hideForEmployees is true
      if (link.hideForEmployees && isAuthenticated() && !isAdmin()) {
        return false;
      }
      if (link.public) return true;
      if (link.adminOnly && isAdmin()) return true;
      if (link.userOnly && isAuthenticated() && !isAdmin()) return true;
      return false;
    });
  }, [isAuthenticated, isAdmin]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <nav className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex shrink-0 items-center rounded-full px-2 py-1"
        >
          <img 
            src="https://res.cloudinary.com/duc9svg7w/image/upload/v1763808251/pravara_logo_bmg7bj.png" 
            alt="Pravara Health Care Logo" 
            className="h-9 w-auto sm:h-10"
          />
        </NavLink>

        {/* Mobile Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isOpen
                  ? "M6 18 18 6M6 6l12 12"
                  : "M3.75 7.5h16.5m-16.5 4.5h16.5m-16.5 4.5H18"
              }
            />
          </svg>
        </button>

        {/* Links */}
        <div
          id="primary-navigation"
          className={`${
            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          } absolute inset-x-4 top-[calc(100%+0.75rem)] grid overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-lg transition-[grid-template-rows] duration-200 z-50
          lg:static lg:inset-auto lg:grid-rows-[1fr] lg:flex lg:flex-1 lg:justify-center 
          lg:rounded-none lg:bg-transparent lg:border-0 lg:px-4 lg:shadow-none lg:z-auto`}
        >
          <div className="overflow-hidden lg:flex lg:w-full lg:justify-center lg:overflow-visible">
            <ul className="flex flex-col gap-1 px-3 py-3 text-sm text-gray-700 
                           lg:flex-row lg:items-center lg:justify-center lg:gap-2 lg:px-0 lg:py-0">
              {navLinks.map((link) => (
                <li key={link.label} className="lg:flex">
                  <NavLink
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-2 rounded-lg px-3 py-2.5 transition-all",
                        "hover:bg-gray-100 hover:text-gray-900 active:scale-95",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200"
                          : "text-gray-600",
                      ].join(" ")
                    }
                  >
                    <span className="text-xs font-medium sm:text-sm">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Menu / Login Button */}
        <div className="flex items-center gap-2">
          {isAuthenticated() ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100">
                <span className="text-xs font-medium text-gray-700">
                  {isAdmin() ? '🔐 Admin' : `👤 ${user?.employeeId || 'User'}`}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Login</span>
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
