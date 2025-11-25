import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const topLineData = [
  { month: "Jan", totalSales: 320 },
  { month: "Feb", totalSales: 360 },
  { month: "Mar", totalSales: 410 },
  { month: "Apr", totalSales: 455 },
  { month: "May", totalSales: 520 },
  { month: "Jun", totalSales: 565 },
];

const summaryStats = [
  { label: "Revenue", value: "₹320.4K", trend: "+8.2%", trendTone: "text-[#A020F0]", progress: 78, progressTone: "bg-[#A020F0]" },
  { label: "Orders", value: "31.6K", trend: "+3.4%", trendTone: "text-[#D400FF]", progress: 64, progressTone: "bg-[#D400FF]" },
  { label: "Avg. Order Value", value: "₹4.2K", trend: "+₹0.12K", trendTone: "text-[#FF00CC]", progress: 55, progressTone: "bg-[#FF00CC]" },
  { label: "New Cust. Per Mo", value: "12.6K", trend: "+1.9K", trendTone: "text-[#A020F0]", progress: 82, progressTone: "bg-[#A020F0]" },
];

const funnelStages = [
  {
    step: "Visitors",
    value: "256.2K",
    conversion: "50.4% to Activity",
    color: "from-lime-300 via-lime-400 to-emerald-500",
  },
  {
    step: "Product Views",
    value: "198.4K",
    conversion: "To cart initiation 32.1%",
    color: "from-emerald-400 via-emerald-500 to-teal-500",
  },
  {
    step: "Add to Cart",
    value: "139.2K",
    conversion: "Cart conversion 24.2%",
    color: "from-teal-500 via-cyan-500 to-sky-500",
  },
  {
    step: "Check Out",
    value: "9.4K",
    conversion: "Checkout abandonment 6.4%",
    color: "from-sky-500 via-blue-500 to-indigo-500",
  },
  {
    step: "Complete Order",
    value: "5.9K",
    conversion: "Final conversion 3.8%",
    color: "from-indigo-500 via-indigo-600 to-slate-700",
  },
];

const lifetimeRevenueData = [
  { month: "Jan", newCustomers: 120, returningCustomers: 80 },
  { month: "Feb", newCustomers: 180, returningCustomers: 120 },
  { month: "Mar", newCustomers: 260, returningCustomers: 190 },
  { month: "Apr", newCustomers: 310, returningCustomers: 240 },
  { month: "May", newCustomers: 370, returningCustomers: 280 },
  { month: "Jun", newCustomers: 420, returningCustomers: 320 },
];

const retentionMatrix = [
  { month: "Jan", cohorts: ["100%", "88.7%", "82.1%", "74.5%", "68.0%", "61.4%"] },
  { month: "Feb", cohorts: ["100%", "90.1%", "84.3%", "77.2%", "69.6%", "63.0%"] },
  { month: "Mar", cohorts: ["100%", "91.2%", "85.7%", "79.9%", "73.1%", "67.8%"] },
  { month: "Apr", cohorts: ["100%", "92.3%", "86.9%", "80.5%", "74.2%", "68.6%"] },
  { month: "May", cohorts: ["100%", "89.9%", "83.6%", "77.4%", "70.8%", "65.5%"] },
  { month: "Jun", cohorts: ["100%", "87.6%", "81.4%", "74.9%", "68.2%", "62.7%"] },
];

const retentionColors = ["bg-[#A020F0]", "bg-[#D400FF]", "bg-[#FF00CC]", "bg-[#A020F0]", "bg-[#D400FF]", "bg-[#FF00CC]"];

const areaData = [
  { name: "Step 1", value: 100 },
  { name: "Step 2", value: 78 },
  { name: "Step 3", value: 52 },
  { name: "Step 4", value: 28 },
  { name: "Step 5", value: 16 },
];

const kpiCards = [
  {
    title: "Total Salary Payout",
    value: "₹8.95L",
    helper: "+5.2% vs last month",
    badge: "On Track",
    color: "#EC4899", // Pink
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Total Incentives",
    value: "₹95K",
    helper: "+8.4% vs last month",
    badge: "Growing",
    color: "#6366F1", // Indigo
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: "Total Gifts",
    value: "₹20K",
    helper: "+₹2K vs last month",
    badge: "Above target",
    color: "#14B8A6", // Teal
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v-1.5a2.25 2.25 0 0 0-1.5-2.143l-5-1.429a2.25 2.25 0 0 0-1.5 0l-5 1.429a2.25 2.25 0 0 0-1.5 2.143v1.5m9 0h.008v.008H12v-.008Zm-9 0H3m9 0v1.5m0 0v4.5m0-4.5H3m9 4.5v1.5m0 0v4.5m0-4.5H3m9 4.5v1.5m0 0H3m9 0h.008v.008H12V21Zm-9 0h1.5m13.5 0h1.5" />
      </svg>
    ),
  },
  {
    title: "Total Expenses",
    value: "₹3.28L",
    helper: "+6.3% vs last month",
    badge: "Controlled",
    color: "#F97316", // Orange
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

// Revenue Distribution data
const revenueByCategory = [
  { name: "Consultation", value: 38, color: "#8B5CF6", amount: "₹340.3K", growth: "+8.2%" },
  { name: "Diagnostics", value: 28, color: "#EC4899", amount: "₹250.7K", growth: "+12.5%" },
  { name: "Pharmacy", value: 18, color: "#06B6D4", amount: "₹161.2K", growth: "+12%" },
  { name: "Surgery", value: 8, color: "#F59E0B", amount: "₹71.6K", growth: "0%" },
  { name: "Other Services", value: 4, color: "#1E40AF", amount: "₹35.8K", growth: "+5%" },
];

// Employee Distribution data
const employeeByDepartment = [
  { name: "Clinical Staff", value: 35, color: "#F59E0B", employees: 245, growth: "+12%", avgSalary: "₹1,85,000" },
  { name: "Administrative", value: 28, color: "#DC2626", employees: 196, growth: "+8%", avgSalary: "₹95,000" },
  { name: "Support Services", value: 18, color: "#84CC16", employees: 126, growth: "+6%", avgSalary: "₹65,000" },
  { name: "Technical", value: 12, color: "#06B6D4", employees: 84, growth: "+10%", avgSalary: "₹1,20,000" },
  { name: "Other", value: 7, color: "#6B7280", employees: 49, growth: "+4%", avgSalary: "₹75,000" },
];

// Revenue Variance data for ComposedChart
const revenueVarianceData = [
  { month: "Jan", exec1: 2.5, exec2: -1.2, exec3: 3.8, exec4: 0.5, exec5: -2.1 },
  { month: "Feb", exec1: 3.1, exec2: 0.8, exec3: 4.2, exec4: 1.2, exec5: -1.5 },
  { month: "Mar", exec1: -0.5, exec2: 2.3, exec3: 1.8, exec4: -0.8, exec5: 3.2 },
  { month: "Apr", exec1: 4.2, exec2: -2.1, exec3: 2.5, exec4: 1.8, exec5: -0.9 },
  { month: "May", exec1: 1.5, exec2: 3.4, exec3: -1.2, exec4: 2.1, exec5: 0.8 },
  { month: "Jun", exec1: 2.8, exec2: 1.2, exec3: 3.5, exec4: -1.5, exec5: 2.3 },
];

const actionItems = [
  {
    title: "Launch A/B test on checkout copy",
    owner: "Growth Team",
    due: "Due tomorrow",
    tone: "border-[#A020F0] bg-neon-gradient-blur text-white",
  },
  {
    title: "Review VIP loyalty tier pricing",
    owner: "Finance & CRM",
    due: "Due Friday",
    tone: "border-[#D400FF] bg-neon-gradient-blur text-white",
  },
  {
    title: "Enable referral bonus tracking",
    owner: "Product Ops",
    due: "In progress",
    tone: "border-[#FF00CC] bg-neon-gradient-blur text-white",
  },
];

const retentionLegend = [
  { label: "95%+", bgColor: "#F97316", textColor: "#FFFFFF" }, // Orange
  { label: "90-95%", bgColor: "#EF4444", textColor: "#FFFFFF" }, // Red
  { label: "85-90%", bgColor: "#84CC16", textColor: "#FFFFFF" }, // Light Green
  { label: "75-85%", bgColor: "#06B6D4", textColor: "#FFFFFF" }, // Light Blue
  { label: "65-75%", bgColor: "#6B7280", textColor: "#FFFFFF" }, // Grey
  { label: "<65%", bgColor: "#F59E0B", textColor: "#FFFFFF" }, // Darker Orange/Yellow
];

// Function to get retention color based on percentage
const getRetentionColor = (percentage) => {
  const num = parseFloat(percentage.replace('%', ''));
  if (num >= 95) return { bg: "#F97316", text: "#FFFFFF", border: "#EA580C" }; // Orange
  if (num >= 90) return { bg: "#EF4444", text: "#FFFFFF", border: "#DC2626" }; // Red
  if (num >= 85) return { bg: "#84CC16", text: "#FFFFFF", border: "#65A30D" }; // Light Green
  if (num >= 75) return { bg: "#06B6D4", text: "#FFFFFF", border: "#0891B2" }; // Light Blue
  if (num >= 65) return { bg: "#6B7280", text: "#FFFFFF", border: "#4B5563" }; // Grey
  return { bg: "#F59E0B", text: "#FFFFFF", border: "#D97706" }; // Darker Orange/Yellow
};

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeRevenueIndex, setActiveRevenueIndex] = useState(null);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [activeEmployeeIndex, setActiveEmployeeIndex] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalRevenue = revenueByCategory.reduce((sum, item) => sum + item.value, 0) * 10000; // Approximate total
  const totalEmployees = employeeByDepartment.reduce((sum, item) => sum + item.employees, 0);

  const handleRevenueClick = (data, index) => {
    setActiveRevenueIndex(index);
    setSelectedRevenue(revenueByCategory[index]);
  };

  const handleEmployeeClick = (data, index) => {
    setActiveEmployeeIndex(index);
    setSelectedEmployee(employeeByDepartment[index]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex grow">
        <div className="flex w-full flex-col gap-6 sm:gap-8 px-3 py-4 sm:px-6 lg:px-8 xl:px-12">
          <header className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Overview Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">Sales overview · Jan 1, 2023 – Jun 30, 2023</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100">
                Last 6 months
              </button>
              <button className="rounded-md border border-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50">
                Export
              </button>
            </div>
          </header>

          {/* KPI CARDS */}
          <section className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((card) => {
              return (
                <article
                  key={card.title}
                  className="relative rounded-lg p-3 sm:p-5 overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:brightness-110"
                  style={{
                    backgroundColor: card.color,
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'",
                  }}
                >
                  {/* Large background icon */}
                  <div 
                    className="absolute right-0 top-0 pointer-events-none transition-transform duration-300 group-hover:scale-110"
                    style={{
                      transform: 'translate(15%, -15%)',
                      opacity: 0.2,
                    }}
                  >
                    {React.cloneElement(card.icon, {
                      className: 'h-20 w-20 sm:h-32 sm:w-32 transition-transform duration-300',
                      style: { color: 'white', opacity: 0.2 }
                    })}
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 transition-transform duration-300">
                    <div className="flex items-start justify-between mb-2 sm:mb-4">
                      <span 
                        className="rounded-full bg-white/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[0.55rem] sm:text-[0.65rem] font-medium text-white transition-all duration-300 hover:bg-white/30"
                        style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}
                      >
                        {card.badge}
                      </span>
                    </div>
                    <p 
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 transition-transform duration-300 hover:scale-105" 
                      style={{ 
                        letterSpacing: '-0.03em',
                        fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'",
                        fontWeight: 700
                      }}
                    >
                      {card.value}
                    </p>
                    <h2 
                      className="text-xs sm:text-sm font-medium text-white/90 mb-2 transition-opacity duration-300"
                      style={{ fontFamily: "'Poppins', 'Montserrat', 'Open Sans', sans-serif" }}
                    >
                      {card.title}
                    </h2>
                    <p 
                      className="text-xs sm:text-sm font-normal text-white/80 flex items-center gap-1 transition-transform duration-300" 
                    style={{ 
                      letterSpacing: '0',
                      fontFamily: "'Poppins', 'Montserrat', 'Open Sans', sans-serif"
                    }}
                    >
                      <span className="transition-transform duration-300 hover:scale-125">{card.helper.includes('+') ? '↑' : '↓'}</span>
                      {card.helper}
                    </p>
                  </div>
                </article>
              );
            })}
          </section>

          {/* REVENUE DISTRIBUTION */}
          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-4" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <div className="mb-2 sm:mb-3 lg:mb-3">
                <h3 className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500 mb-1" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Revenue Distribution</h3>
                <p className="text-[0.65rem] sm:text-xs text-gray-500">Category wise revenue breakdown across all services</p>
              </div>
              <div className="relative h-56 sm:h-64 lg:h-56 overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="white" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            fontSize={isMobile ? 9 : 11}
                            fontWeight="bold"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}
                          >
                            {(percent * 100).toFixed(0)}%
                          </text>
                        );
                      }}
                      outerRadius={isMobile ? 90 : 100}
                      innerRadius={isMobile ? 45 : 50}
                      fill="#8884d8"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={3}
                      animationDuration={2000}
                      animationEasing="ease-out"
                      onClick={handleRevenueClick}
                      activeIndex={activeRevenueIndex}
                      activeShape={{
                        outerRadius: isMobile ? 100 : 110,
                        innerRadius: isMobile ? 40 : 45,
                      }}
                    >
                      {revenueByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-2">
                  <div className="text-center space-y-0.5 sm:space-y-1">
                    {selectedRevenue ? (
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="text-base sm:text-xl lg:text-2xl font-bold leading-tight" style={{ color: selectedRevenue.color }}>
                          {selectedRevenue.value}%
                        </div>
                        <div className="text-[0.55rem] sm:text-[0.65rem] lg:text-xs font-semibold text-gray-700 leading-tight">
                          {selectedRevenue.name}
                        </div>
                        <div className="text-[0.5rem] sm:text-[0.6rem] lg:text-[0.65rem] text-gray-500 leading-tight">
                          {selectedRevenue.amount}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                          ₹895.4K
                        </div>
                        <div className="text-[0.55rem] sm:text-[0.65rem] lg:text-xs font-semibold text-gray-600 leading-tight">
                          TOTAL REVENUE
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {revenueByCategory.map((item, index) => (
                  <div 
                    key={item.name} 
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors border ${
                      activeRevenueIndex === index ? 'bg-gray-50 border-gray-300' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRevenueClick(item, index)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <span 
                        className="h-3 w-3 sm:h-4 sm:w-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-[0.65rem] sm:text-xs text-gray-500">{item.value}% share</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.growth}</p>
                      <p className="text-[0.65rem] sm:text-xs text-gray-500">growth</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* EMPLOYEE DISTRIBUTION */}
            <article className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-4" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <div className="mb-2 sm:mb-3 lg:mb-3">
                <h3 className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500 mb-1" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Employee Distribution</h3>
                <p className="text-[0.65rem] sm:text-xs text-gray-500">Department-wise workforce allocation across Pravara Health Care</p>
              </div>
              <div className="relative h-56 sm:h-64 lg:h-56 overflow-visible">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <Pie
                      data={employeeByDepartment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="white" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            fontSize={isMobile ? 9 : 11}
                            fontWeight="bold"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}
                          >
                            {(percent * 100).toFixed(0)}%
                          </text>
                        );
                      }}
                      outerRadius={isMobile ? 90 : 100}
                      innerRadius={isMobile ? 45 : 50}
                      fill="#8884d8"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={3}
                      animationDuration={2000}
                      animationEasing="ease-out"
                      onClick={handleEmployeeClick}
                      activeIndex={activeEmployeeIndex}
                      activeShape={{
                        outerRadius: isMobile ? 100 : 110,
                        innerRadius: isMobile ? 40 : 45,
                      }}
                    >
                      {employeeByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-2">
                  <div className="text-center space-y-0.5 sm:space-y-1">
                    {selectedEmployee ? (
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="text-base sm:text-xl lg:text-2xl font-bold leading-tight" style={{ color: selectedEmployee.color }}>
                          {selectedEmployee.value}%
                        </div>
                        <div className="text-[0.55rem] sm:text-[0.65rem] lg:text-xs font-semibold text-gray-700 leading-tight">
                          {selectedEmployee.name}
                        </div>
                        <div className="text-[0.5rem] sm:text-[0.6rem] lg:text-[0.65rem] text-gray-500 leading-tight">
                          {selectedEmployee.employees} employees
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight">
                          {totalEmployees}
                        </div>
                        <div className="text-[0.5rem] sm:text-[0.6rem] lg:text-[0.65rem] font-semibold text-gray-600 leading-tight">
                          TOTAL EMPLOYEES
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {employeeByDepartment.map((item, index) => (
                  <div 
                    key={item.name} 
                    className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors border ${
                      activeEmployeeIndex === index ? 'bg-gray-50 border-gray-300' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleEmployeeClick(item, index)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <span 
                        className="h-3 w-3 sm:h-4 sm:w-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-[0.65rem] sm:text-xs text-gray-500">{item.value}% share, {item.employees} employees</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.growth}</p>
                      <p className="text-[0.65rem] sm:text-xs text-gray-500">Avg Salary {item.avgSalary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* TOTAL SALES + SUMMARY */}
          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Total Sales</p>
                  <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold">₹895.39K</h2>
                  <p className="text-[0.65rem] sm:text-xs text-gray-500">last 30 days · +12.5% vs previous period</p>
                </div>
                <div className="mt-2 sm:mt-3 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 sm:px-3 sm:py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
                  Jan 1, 2023 – Jun 30, 2023
                </div>
              </div>

              {/* BAR GRAPH */}
              <div className="mt-4 sm:mt-6 h-36 sm:h-40 lg:h-48">
                <ResponsiveContainer>
                  <BarChart data={topLineData} margin={{ top: 10, right: isMobile ? 5 : 16, left: isMobile ? -10 : 0, bottom: isMobile ? 5 : 10 }}>
                    <CartesianGrid stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: "#6B7280", fontSize: isMobile ? 10 : 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: "#6B7280", fontSize: isMobile ? 10 : 12 }} tickFormatter={(value) => `₹${value}K`} width={isMobile ? 40 : 60} />
                <Tooltip
                    labelFormatter={(label) => `Month: ${label}`}
                    formatter={(value) => [`₹${value}K`, "Revenue"]} 
                    contentStyle={{
                    borderRadius: "1rem",
                    borderColor: "#E5E7EB",
                    backgroundColor: "#FFFFFF",
                    color: "#111827",
                    }}
                />

                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 8, color: "#111827" }} />
                    <Bar dataKey="totalSales" name="Revenue" fill="#6366F1" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <p className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Summary</p>
              <p className="mt-1 sm:mt-2 text-[0.65rem] sm:text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>

              <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                {summaryStats.map((stat) => (
                  <article key={stat.label} className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <p className="text-[0.65rem] sm:text-xs font-semibold tracking-[0.05em] text-gray-500" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>{stat.label}</p>
                      <span className={`text-[0.65rem] sm:text-xs font-semibold text-emerald-600`}>{stat.trend}</span>
                    </div>
                    <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-semibold">{stat.value}</p>
                    <div className="mt-3 sm:mt-4 h-1.5 sm:h-2 w-full rounded-full bg-gray-100">
                      <div className={`h-1.5 sm:h-2 rounded-full bg-indigo-500`} style={{ width: `${stat.progress}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>

          {/* SALES FUNNEL + LTV */}
          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
            
            {/* SALES FUNNEL */}
            <article className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Sales Funnel</p>
                  <p className="text-[0.65rem] sm:text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <div className="mt-2 sm:mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 sm:px-3 sm:py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
                    +4.8% completion
                  </span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 h-36 sm:h-40 lg:h-48">
                <ResponsiveContainer>
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="funnelGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="50%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: "#6B7280", fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Stage completion"]}

                      contentStyle={{
                        borderRadius: "1rem",
                        borderColor: "#E5E7EB",
                        backgroundColor: "#FFFFFF",
                        color: "#111827"
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366F1" fill="url(#funnelGradient)" strokeWidth={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-5">
                {funnelStages.map((stage) => (
                  <div key={stage.step} className="flex flex-col gap-1 rounded-md border border-gray-200 bg-white p-2 sm:p-3" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
                    <p className="text-[0.6rem] sm:text-[10px] lg:text-xs font-semibold tracking-[0.05em] text-gray-500 truncate" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>{stage.step}</p>
                    <p className="text-base sm:text-lg font-semibold">{stage.value}</p>
                    <p className="text-[0.6rem] sm:text-[0.65rem] text-gray-500">{stage.conversion}</p>
                    <div className="mt-auto h-1.5 sm:h-2 rounded-full bg-indigo-500" />
                  </div>
                ))}
              </div>
            </article>

            {/* REVENUE VARIANCE CHART */}
            <article className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500 break-words" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Revenue % Variance to Budget by Month and Executive</p>
                  <p className="text-[0.65rem] sm:text-xs text-gray-500 mt-1">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <span className="mt-2 sm:mt-3 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 sm:px-3 sm:py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
                  Variance Analysis
                </span>
              </div>

              <div className="mt-4 sm:mt-6 h-36 sm:h-40 lg:h-48">
                <ResponsiveContainer>
                  <ComposedChart data={revenueVarianceData} margin={{ top: 10, right: isMobile ? 5 : 20, left: isMobile ? -10 : 0, bottom: isMobile ? 5 : 10 }}>
                    <defs>
                      <linearGradient id="exec1Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="exec2Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="exec3Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="exec4Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="exec5Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: "#6B7280", fontSize: isMobile ? 10 : 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: "#6B7280", fontSize: isMobile ? 10 : 12 }} tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      labelFormatter={(label) => `Month: ${label}`}
                      formatter={(value) => [`${value}%`, "Variance"]}
                      contentStyle={{
                        borderRadius: "1rem",
                        borderColor: "#E5E7EB",
                        backgroundColor: "#FFFFFF",
                        color: "#111827",
                        fontSize: isMobile ? '12px' : '14px'
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle" 
                      wrapperStyle={{ 
                        paddingBottom: 8, 
                        color: "#111827",
                        fontSize: isMobile ? '10px' : '12px'
                      }} 
                    />
                    <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" strokeWidth={1} />
                    <Area type="monotone" dataKey="exec1" stackId="1" fill="url(#exec1Gradient)" stroke="#8B5CF6" strokeWidth={1} name="Executive 1" />
                    <Area type="monotone" dataKey="exec2" stackId="1" fill="url(#exec2Gradient)" stroke="#6366F1" strokeWidth={1} name="Executive 2" />
                    <Area type="monotone" dataKey="exec3" stackId="1" fill="url(#exec3Gradient)" stroke="#10B981" strokeWidth={1} name="Executive 3" />
                    <Area type="monotone" dataKey="exec4" stackId="1" fill="url(#exec4Gradient)" stroke="#F59E0B" strokeWidth={1} name="Executive 4" />
                    <Area type="monotone" dataKey="exec5" stackId="1" fill="url(#exec5Gradient)" stroke="#EF4444" strokeWidth={1} name="Executive 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          {/* RETENTION + ACTION CENTER */}
          <section className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Customer Retention</p>
                  <p className="text-[0.65rem] sm:text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <span className="mt-2 sm:mt-3 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 sm:px-3 sm:py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
                  87% avg retention
                </span>
              </div>

              <div className="mt-4 sm:mt-6 -mx-2 sm:mx-0 overflow-x-auto">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-1 sm:border-spacing-2 text-[9px] sm:text-[10px] lg:text-xs font-semibold tracking-[0.05em]" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>
                  <thead>
                    <tr>
                      <th className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-gray-500">Month</th>
                      {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"].map((label) => (
                        <th key={label} className="px-1.5 py-1.5 sm:px-3 sm:py-2 text-center text-gray-500">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {retentionMatrix.map((row) => (
                      <tr key={row.month}>
                        <td className="px-2 py-1.5 sm:px-3 sm:py-2 text-left text-xs sm:text-sm font-semibold">{row.month}</td>
                        {row.cohorts.map((value, idx) => {
                          const colors = getRetentionColor(value);
                          return (
                            <td key={`${row.month}-${idx}`} className="px-0.5 py-0.5 sm:px-1 sm:py-1 text-center">
                              <div 
                                className="rounded-lg border px-1.5 py-2 sm:px-2 sm:py-3 text-[0.65rem] sm:text-xs font-semibold"
                                style={{
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  borderColor: colors.border,
                                }}
                              >
                                {value}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                    </table>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 text-[0.65rem] sm:text-xs text-gray-600">
                {retentionLegend.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white px-2 py-0.5 sm:px-3 sm:py-1">
                    <span 
                      className="h-1.5 w-4 sm:h-2 sm:w-6 rounded-full" 
                      style={{ backgroundColor: item.bgColor }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </article>

            <article className="flex flex-col gap-3 sm:gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-5 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.05em] text-gray-500" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>Action Center</p>
                  <p className="text-[0.65rem] sm:text-xs text-gray-500">Keep momentum high with these next steps</p>
                </div>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 sm:px-2 sm:py-1 lg:px-3 text-[0.6rem] sm:text-[10px] lg:text-xs font-semibold text-blue-700 whitespace-nowrap">3 open</span>
              </div>

              <ul className="space-y-2 sm:space-y-3">
                {actionItems.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium"
                    style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
                  >
                    <p>{item.title}</p>
                    <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[0.65rem] sm:text-xs font-semibold tracking-[0.05em] text-gray-500" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}>
                      <span>{item.owner}</span>
                      <span>{item.due}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <button className="mt-auto rounded-md border border-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50">
                View full roadmap
              </button>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
