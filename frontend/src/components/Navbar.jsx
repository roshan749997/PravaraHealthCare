import { useState } from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Employees", to: "/employees" },
  { label: "Payroll", to: "/payroll" },
  { label: "Total Salaries", to: "/total-salaries" },
  { label: "Financial Analytics", to: "/financial-analytics" },
  { label: "Other Expenses", to: "/other-expenses" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // ⭐ Removed transparency & glass → added solid background
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <nav className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex shrink-0 items-center gap-3 rounded-full px-2 py-1"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold uppercase text-white sm:h-10 sm:w-10 sm:text-base">
            PH
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 sm:text-base">
              Pravara Health Care
            </span>
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-gray-500 sm:text-xs">
              Employee CRM
            </span>
          </div>
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
          } absolute inset-x-4 top-[calc(100%+0.75rem)] grid overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-lg transition-[grid-template-rows] duration-200 
          lg:static lg:inset-auto lg:grid-rows-[1fr] lg:flex lg:flex-1 lg:justify-center 
          lg:rounded-none lg:bg-transparent lg:border-0 lg:px-4 lg:shadow-none`}
        >
          <div className="overflow-hidden lg:flex lg:w-full lg:justify-center lg:overflow-visible">
            <ul className="flex flex-col gap-1 px-4 py-4 text-sm text-gray-700 
                           lg:flex-row lg:items-center lg:justify-center lg:gap-3 lg:px-0 lg:py-0">
              {navLinks.map((link) => (
                <li key={link.label} className="lg:flex">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-2 rounded-full px-3 py-2 transition",
                        "hover:bg-gray-100 hover:text-gray-900",
                        isActive
                          ? "bg-gray-100 text-indigo-600"
                          : "text-gray-600",
                      ].join(" ")
                    }
                  >
                    <span className="text-sm font-semibold">{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </nav>
    </header>
  );
}
