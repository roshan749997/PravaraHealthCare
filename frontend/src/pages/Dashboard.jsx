import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

// Employee Distribution colors for Customer Retention
const retentionEmployeeColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];
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
    title: "Conversion Rate",
    value: "3.8%",
    helper: "+0.6pp vs last month",
    gradient: "from-[#A020F0] via-[#D400FF] to-[#FF00CC]",
    badge: "Healthy",
    badgeTone: "bg-white/20 text-white",
    color: "#F59E0B", // Orange - Employee Distribution color
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3.75 4.5 12h6l-3.75 8.25L19.5 12h-6l3.75-8.25-5.25 6" />
      </svg>
    ),
  },
  {
    title: "Returning Customers",
    value: "58%",
    helper: "+4% QoQ",
    gradient: "from-[#D400FF] via-[#A020F0] to-[#FF00CC]",
    badge: "Growing",
    badgeTone: "bg-white/20 text-white",
    color: "#DC2626", // Red - Employee Distribution color
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v10.5m0 0 3.75-3.75M12 17.25 8.25 13.5M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
      </svg>
    ),
  },
  {
    title: "Average Basket",
    value: "₹148.90",
    helper: "+₹12 vs goal",
    gradient: "from-[#FF00CC] via-[#D400FF] to-[#A020F0]",
    badge: "Above target",
    badgeTone: "bg-white/20 text-white",
    color: "#84CC16", // Lime Green - Employee Distribution color
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2.25l1.5 12.75A2.25 2.25 0 0 0 8.99 18h6.02a2.25 2.25 0 0 0 2.24-2.25L18.75 6H5.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8.25 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
      </svg>
    ),
  },
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
  { label: "95%+", tone: "bg-emerald-600" },
  { label: "90-95%", tone: "bg-emerald-500" },
  { label: "85-90%", tone: "bg-emerald-400" },
  { label: "75-85%", tone: "bg-lime-400" },
  { label: "65-75%", tone: "bg-lime-300" },
  { label: "<65%", tone: "bg-yellow-300" },
];

const departmentDistribution = [
  {
    name: "Clinical Staff",
    value: 35,
    employees: 245,
    color: "#F59E0B",
    avgSalary: "₹1,85,000",
    growth: "+12%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    description: "Doctors, nurses, and medical professionals providing direct patient care services.",
  },
  {
    name: "Administrative",
    value: 28,
    employees: 196,
    color: "#DC2626",
    avgSalary: "₹95,000",
    growth: "+8%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    description: "Management, HR, finance, and operational staff handling day-to-day operations.",
  },
  {
    name: "Support Services",
    value: 18,
    employees: 126,
    color: "#84CC16",
    avgSalary: "₹65,000",
    growth: "+15%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.645-5.963-1.88A6.979 6.979 0 0 1 6 18.72m3.138-5.961a3.375 3.375 0 0 0-6.552.753m11.318 0a3.375 3.375 0 0 0-6.552-.753m0 0a3.375 3.375 0 0 0-5.586-2.5" />
      </svg>
    ),
    description: "Housekeeping, maintenance, security, and facility management personnel.",
  },
  {
    name: "Technical Staff",
    value: 12,
    employees: 84,
    color: "#06B6D4",
    avgSalary: "₹1,20,000",
    growth: "+22%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.645-5.963-1.88A6.979 6.979 0 0 1 6 18.72m3.138-5.961a3.375 3.375 0 0 0-6.552.753m11.318 0a3.375 3.375 0 0 0-6.552-.753m0 0a3.375 3.375 0 0 0-5.586-2.5" />
      </svg>
    ),
    description: "IT support, lab technicians, and technical specialists maintaining equipment.",
  },
  {
    name: "Other",
    value: 7,
    employees: 49,
    color: "#6B7280",
    avgSalary: "₹75,000",
    growth: "+5%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    description: "Consultants, part-time staff, and other specialized roles across departments.",
  },
];

const totalEmployees = departmentDistribution.reduce((sum, dept) => sum + dept.employees, 0);

// Revenue by Category Distribution
const revenueByCategory = [
  {
    name: "Consultation",
    value: 42,
    amount: "₹376.1K",
    color: "#8B5CF6",
    growth: "+18%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.125M8.25 8.25l2.25-2.25m0 0 2.25 2.25m-2.25-2.25v11.25" />
      </svg>
    ),
    description: "Doctor consultations, follow-ups, and medical advice services.",
  },
  {
    name: "Diagnostics",
    value: 28,
    amount: "₹250.7K",
    color: "#EC4899",
    growth: "+12%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232 1.232 3.228 0 4.46s-3.228 1.232-4.46 0l-1.403-1.402m-7.007 4.007L3 20.25M14.25 3.104l-4.5-4.5" />
      </svg>
    ),
    description: "Lab tests, imaging, and diagnostic procedures revenue.",
  },
  {
    name: "Pharmacy",
    value: 18,
    amount: "₹161.2K",
    color: "#10B981",
    growth: "+25%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232 1.232 3.228 0 4.46s-3.228 1.232-4.46 0l-1.403-1.402m-7.007 4.007L3 20.25M14.25 3.104l-4.5-4.5" />
      </svg>
    ),
    description: "Medicine sales and pharmaceutical products revenue.",
  },
  {
    name: "Surgery",
    value: 8,
    amount: "₹71.6K",
    color: "#F59E0B",
    growth: "+8%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    description: "Surgical procedures and operation theater revenue.",
  },
  {
    name: "Other Services",
    value: 4,
    amount: "₹35.8K",
    color: "#6366F1",
    growth: "+5%",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    description: "Emergency services, ambulance, and other miscellaneous revenue.",
  },
];

const totalRevenue = revenueByCategory.reduce((sum, cat) => {
  const amount = parseFloat(cat.amount.replace(/[₹,K]/g, ''));
  return sum + amount;
}, 0);

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [activeRevenueIndex, setActiveRevenueIndex] = useState(null);
  const [selectedRevenue, setSelectedRevenue] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePieClick = (data, index) => {
    setActiveIndex(index);
    setSelectedDept(data);
  };

  const handleDeptClick = (dept, index) => {
    setActiveIndex(index);
    setSelectedDept(dept);
  };

  const handleRevenueClick = (data, index) => {
    setActiveRevenueIndex(index);
    setSelectedRevenue(data);
  };

  const handleRevenueBoxClick = (revenue, index) => {
    setActiveRevenueIndex(index);
    setSelectedRevenue(revenue);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex grow">
        <div className="flex w-full flex-col gap-6 sm:gap-8 px-3 py-4 sm:px-6 lg:px-8 xl:px-12">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Overview Dashboard</h1>
              <p className="text-sm text-gray-500">Sales overview · Jan 1, 2023 – Jun 30, 2023</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Last 6 months
              </button>
              <button className="rounded-md border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                Export
              </button>
            </div>
          </header>

          {/* KPI CARDS */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {kpiCards.map((card) => {
              const bgColor = `${card.color}15`; // 15% opacity for background
              const iconColor = card.color;
              const borderColor = `${card.color}40`; // 40% opacity for border
              
              return (
                <article
                  key={card.title}
                  className="rounded-lg bg-white p-5"
                  style={{
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: borderColor,
                  }}
                >
                  <div className="relative flex items-start justify-between">
                    <div 
                      className="rounded-md p-2"
                      style={{
                        backgroundColor: bgColor,
                        color: iconColor,
                      }}
                    >
                      {card.icon}
                    </div>
                    <span className={`rounded-full bg-gray-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gray-600`}>
                      {card.badge}
                    </span>
                  </div>
                  <h2 className="relative mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                    {card.title}
                  </h2>
                  <p className="relative mt-2 text-3xl font-semibold">{card.value}</p>
                  <p className="relative mt-2 text-sm font-medium text-gray-500">{card.helper}</p>
                </article>
              );
            })}
          </section>

          {/* REVENUE DISTRIBUTION - DONUT CHART */}
          <section className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-500">Revenue Distribution</p>
                <p className="text-[0.65rem] sm:text-xs text-gray-500 mt-1">Category-wise revenue breakdown across all services</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="mt-2 sm:mt-0 rounded-full border border-blue-200 bg-blue-50 px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
                  Total: ₹{totalRevenue.toFixed(1)}K
                </span>
                {selectedRevenue && (
                  <span 
                    className="mt-2 sm:mt-0 rounded-full px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-xs font-semibold text-white whitespace-nowrap transition-all"
                    style={{ backgroundColor: selectedRevenue.color }}
                  >
                    {selectedRevenue.name}: {selectedRevenue.amount} ({selectedRevenue.value}%)
                  </span>
                )}
              </div>
            </div>

            <div className="relative w-full">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                {/* Pie Chart with Center Info - Sticky on Desktop */}
                <div className="relative flex-shrink-0 lg:sticky lg:top-6 lg:self-start" style={{ width: isMobile ? '100%' : '450px', height: isMobile ? '350px' : '450px', maxWidth: isMobile ? '100%' : '450px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {revenueByCategory.map((item, index) => (
                          <g key={`revenue-defs-${index}`}>
                            <linearGradient id={`revenue-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                              <stop offset="100%" stopColor={item.color} stopOpacity={0.7} />
                            </linearGradient>
                            <filter id={`revenue-glow-${index}`}>
                              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </g>
                        ))}
                      </defs>
                      <Pie
                        data={revenueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={isMobile ? 110 : 150}
                        innerRadius={isMobile ? 50 : 80}
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
                          outerRadius: isMobile ? 120 : 165,
                          innerRadius: isMobile ? 45 : 75,
                        }}
                      >
                        {revenueByCategory.map((entry, index) => (
                          <Cell 
                            key={`revenue-cell-${index}`} 
                            fill={`url(#revenue-gradient-${index})`}
                            stroke={entry.color}
                            strokeWidth={activeRevenueIndex === index ? 4 : 2}
                            style={{
                              filter: activeRevenueIndex === index ? `url(#revenue-glow-${index})` : 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload[0]) return null;
                          const item = revenueByCategory.find(d => d.value === payload[0].value);
                          if (!item) return null;
                          
                          return (
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl" style={{ minWidth: "220px" }}>
                              <div className="space-y-3">
                                <div className="font-semibold text-lg border-b border-gray-200 pb-2" style={{ color: item.color }}>
                                  {item.name}
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600">Percentage:</span>
                                    <span className="font-semibold text-gray-900">{item.value}%</span>
                                  </div>
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600">Revenue:</span>
                                    <span className="font-semibold text-gray-900">{item.amount}</span>
                                  </div>
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600">Growth:</span>
                                    <span className="font-semibold text-emerald-600">{item.growth}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center Information Display */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      {selectedRevenue ? (
                        <div className="space-y-1">
                          <div className="text-2xl sm:text-3xl font-bold" style={{ color: selectedRevenue.color }}>
                            {selectedRevenue.value}%
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-700">
                            {selectedRevenue.name}
                          </div>
                          <div className="text-[0.65rem] sm:text-xs text-gray-500">
                            {selectedRevenue.amount}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                            ₹{totalRevenue.toFixed(1)}K
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Total Revenue
                          </div>
                          <div className="text-[0.65rem] sm:text-xs text-gray-500">
                            Click segment for details
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Callout Boxes with Connecting Lines */}
                <div className="relative flex-1 w-full lg:min-w-0 lg:max-w-full">
                  {/* SVG Container for connecting lines (desktop only) */}
                  <svg
                    className="absolute hidden lg:block pointer-events-none overflow-visible"
                    style={{
                      left: '-200px',
                      top: '50%',
                      width: '600px',
                      height: '400px',
                      transform: 'translateY(-50%)',
                      zIndex: 0,
                    }}
                  >
                    {revenueByCategory.map((item, index) => {
                      const totalAngle = 360;
                      const startAngle = 90;
                      const cumulativeAngle = revenueByCategory
                        .slice(0, index)
                        .reduce((sum, item) => sum + (item.value / 100) * totalAngle, 0);
                      const midAngle = startAngle - cumulativeAngle - (item.value / 100) * totalAngle / 2;
                      const angleRad = (midAngle * Math.PI) / 180;
                      const radius = 130;
                      const x1 = 200 + Math.cos(angleRad) * radius;
                      const y1 = 200 + Math.sin(angleRad) * radius;
                      const x2 = 400;
                      const y2 = 50 + index * 80;
                      
                      return (
                        <line
                          key={`revenue-line-${index}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={item.color}
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity="0.5"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Callout Boxes - Scrollable Container */}
                  <div className="relative z-10 w-full lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:overflow-x-visible lg:pr-4 lg:pl-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:pb-6 lg:pt-2 min-w-0">
                      {revenueByCategory.map((item, index) => (
                      <div
                        key={item.name}
                        onClick={() => handleRevenueBoxClick(item, index)}
                        className={`group relative rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer w-full min-w-0 ${
                          activeRevenueIndex === index 
                            ? 'shadow-xl ring-2 ring-offset-2' 
                            : 'hover:shadow-lg'
                        }`}
                        style={{
                          borderColor: item.color,
                          backgroundColor: activeRevenueIndex === index ? `${item.color}25` : `${item.color}15`,
                          ringColor: item.color,
                          transform: activeRevenueIndex === index ? 'translateY(-2px)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (activeRevenueIndex !== index) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeRevenueIndex !== index) {
                            e.currentTarget.style.transform = 'none';
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-105"
                            style={{
                              backgroundColor: `${item.color}25`,
                              color: item.color,
                            }}
                          >
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900">{item.name}</h3>
                              <span
                                className="text-base sm:text-lg font-bold whitespace-nowrap px-2 py-0.5 rounded-md"
                                style={{ 
                                  color: item.color,
                                  backgroundColor: `${item.color}20`,
                                }}
                              >
                                {item.value}%
                              </span>
                            </div>
                            <p className="text-[0.65rem] sm:text-xs text-gray-600 leading-relaxed mb-2">
                              {item.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Revenue</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.amount}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Growth</p>
                                <p className="text-xs sm:text-sm font-semibold text-emerald-600">{item.growth}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Share</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.value}%</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Category</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TOTAL SALES + SUMMARY */}
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Monthly Sales Trend</p>
                  <h2 className="mt-2 text-3xl font-semibold">₹895.39K</h2>
                  <p className="text-xs text-gray-500">last 30 days · +12.5% vs previous period</p>
                </div>
                <div className="mt-3 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Jan 1, 2023 – Jun 30, 2023
                </div>
              </div>

              {/* Advanced Bar Chart */}
              <div className="mt-6 h-48 sm:h-56 md:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={topLineData} 
                    margin={{ 
                      top: 20, 
                      right: 20, 
                      left: isMobile ? -10 : 0, 
                      bottom: isMobile ? 5 : 10 
                    }}
                    barCategoryGap="15%"
                    barGap={8}
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                        <stop offset="50%" stopColor="#818CF8" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      stroke="rgba(99, 102, 241, 0.15)" 
                      strokeDasharray="3 3" 
                      vertical={false}
                      strokeWidth={1}
                    />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF" 
                      tick={{ 
                        fill: "#6B7280", 
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 500
                      }}
                      axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                      tickLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ 
                        fill: "#6B7280", 
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 500
                      }}
                      tickFormatter={(value) => `₹${value}K`}
                      axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                      tickLine={{ stroke: "#E5E7EB" }}
                      width={isMobile ? 45 : 60}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
                      labelFormatter={(label) => `Month: ${label}`}
                      formatter={(value, name) => {
                        const formattedValue = `₹${value}K`;
                        const percentage = ((value / 565) * 100).toFixed(1);
                        return [
                          <div key="tooltip" className="space-y-1">
                            <div className="font-semibold text-indigo-600">{formattedValue}</div>
                            <div className="text-xs text-gray-500">{percentage}% of peak</div>
                          </div>,
                          "Revenue"
                        ];
                      }}
                      contentStyle={{
                        borderRadius: "0.75rem",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#FFFFFF",
                        color: "#111827",
                        padding: "12px 16px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }}
                      itemStyle={{ padding: "4px 0" }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle" 
                      wrapperStyle={{ 
                        paddingBottom: 12, 
                        color: "#111827",
                        fontSize: "12px"
                      }} 
                    />
                    <Bar 
                      dataKey="totalSales" 
                      name="Revenue" 
                      fill="url(#barGradient)" 
                      radius={[8, 8, 0, 0]}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Summary</p>
              <p className="mt-2 text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>

              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
                {summaryStats.map((stat) => (
                  <article key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">{stat.label}</p>
                      <span className={`text-xs font-semibold text-emerald-600`}>{stat.trend}</span>
                    </div>
                    <p className="mt-3 text-xl font-semibold">{stat.value}</p>
                    <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                      <div className={`h-2 rounded-full bg-indigo-500`} style={{ width: `${stat.progress}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </section>

          {/* SALES FUNNEL + LTV */}
          <section className="grid gap-6 grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
            
            {/* SALES FUNNEL */}
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Sales Funnel</p>
                  <p className="text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    +4.8% completion
                  </span>
                </div>
              </div>

              <div className="mt-6 h-48 sm:h-56 md:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={areaData}
                    margin={{ 
                      top: 20, 
                      right: 20, 
                      left: isMobile ? -10 : 0, 
                      bottom: isMobile ? 5 : 10 
                    }}
                  >
                    <defs>
                      <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                        <stop offset="30%" stopColor="#818CF8" stopOpacity={0.6} />
                        <stop offset="60%" stopColor="#60A5FA" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="funnelStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="50%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      stroke="rgba(99, 102, 241, 0.15)" 
                      strokeDasharray="3 3" 
                      vertical={false}
                      strokeWidth={1}
                    />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF" 
                      tick={{ 
                        fill: "#6B7280", 
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 500
                      }}
                      axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                      tickLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis 
                      hide={!isMobile}
                      stroke="#9CA3AF" 
                      tick={{ 
                        fill: "#6B7280", 
                        fontSize: 10,
                        fontWeight: 500
                      }}
                      tickFormatter={(value) => `${value}%`}
                      axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                      tickLine={{ stroke: "#E5E7EB" }}
                      width={40}
                    />
                    <Tooltip
                      cursor={{ stroke: "#6366F1", strokeWidth: 2, strokeDasharray: "5 5" }}
                      formatter={(value, name) => {
                        const drop = value < 100 ? (100 - value).toFixed(1) : 0;
                        return [
                          <div key="tooltip" className="space-y-1">
                            <div className="font-semibold text-indigo-600">{value}%</div>
                            {drop > 0 && (
                              <div className="text-xs text-gray-500">{drop}% drop from previous</div>
                            )}
                          </div>,
                          "Stage completion"
                        ];
                      }}
                      labelFormatter={(label) => `Stage: ${label}`}
                      contentStyle={{
                        borderRadius: "0.75rem",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#FFFFFF",
                        color: "#111827",
                        padding: "12px 16px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }}
                      itemStyle={{ padding: "4px 0" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="url(#funnelStrokeGradient)" 
                      strokeWidth={3}
                      fill="url(#funnelGradient)" 
                      dot={{ r: 5, fill: "#6366F1", strokeWidth: 2, stroke: "#FFFFFF" }}
                      activeDot={{ r: 7, fill: "#6366F1", strokeWidth: 2, stroke: "#FFFFFF" }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-5">
                {funnelStages.map((stage) => (
                  <div key={stage.step} className="flex flex-col gap-1 rounded-md border border-gray-200 bg-white p-3">
                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-gray-500 truncate">{stage.step}</p>
                    <p className="text-lg font-semibold">{stage.value}</p>
                    <p className="text-[0.65rem] text-gray-500">{stage.conversion}</p>
                    <div className="mt-auto h-2 rounded-full bg-indigo-500" />
                  </div>
                ))}
              </div>
            </article>

            {/* LIFETIME VALUE */}
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-500">Avg Lifetime Revenue</p>
                  <p className="text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <span className="mt-3 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  +₹56K YoY
                </span>
              </div>

              <div className="mt-6 h-48 sm:h-56 md:h-64 lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={lifetimeRevenueData} 
                    margin={{ 
                      top: 20, 
                      right: 20, 
                      left: isMobile ? -10 : 0, 
                      bottom: isMobile ? 5 : 10 
                    }}
                  >
                    <defs>
                      <linearGradient id="newCustomersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="returningCustomersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      stroke="rgba(99, 102, 241, 0.15)" 
                      strokeDasharray="3 3" 
                      vertical={false}
                      strokeWidth={1}
                    />
                    <XAxis 
                      dataKey="month" 
                      stroke="#9CA3AF" 
                      tick={{ 
                        fill: "#6B7280", 
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 500
                      }}
                      axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                      tickLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      tick={{ 
                        fill: "#6B7280", 
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 500
                      }}
                      tickFormatter={(value) => `₹${value}K`}
                      axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                      tickLine={{ stroke: "#E5E7EB" }}
                      width={isMobile ? 45 : 60}
                    />
                    <Tooltip
                      cursor={{ stroke: "#6366F1", strokeWidth: 1, strokeDasharray: "5 5" }}
                      labelFormatter={(label) => `Month: ${label}`}
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        
                        const monthData = lifetimeRevenueData.find(d => d.month === label);
                        const total = monthData ? (monthData.newCustomers + monthData.returningCustomers) : 0;
                        
                        return (
                          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl" style={{ minWidth: "200px" }}>
                            <div className="space-y-2">
                              <div className="font-semibold text-sm border-b border-gray-200 pb-2 text-gray-900">
                                Month: {label}
                              </div>
                              {payload.map((entry, index) => {
                                const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                                return (
                                  <div key={index} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                      <div 
                                        className="h-3 w-3 rounded-full" 
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      <span className="text-sm text-gray-600">{entry.name}:</span>
                                    </div>
                                    <div className="text-right">
                                      <div 
                                        className="text-sm font-semibold"
                                        style={{ color: entry.color }}
                                      >
                                        ₹{entry.value}K
                                      </div>
                                      <div className="text-xs text-gray-500">{percentage}% of total</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="line" 
                      wrapperStyle={{ 
                        paddingBottom: 12, 
                        color: "#111827",
                        fontSize: "12px"
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="newCustomers"
                      stroke="none"
                      fill="url(#newCustomersGradient)"
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="returningCustomers"
                      stroke="none"
                      fill="url(#returningCustomersGradient)"
                      fillOpacity={0.4}
                    />
                    <Line
                      type="monotone"
                      dataKey="newCustomers"
                      stroke="#10B981"
                      strokeWidth={isMobile ? 2.5 : 3}
                      dot={{ 
                        r: isMobile ? 4 : 5, 
                        fill: "#10B981", 
                        strokeWidth: 2, 
                        stroke: "#FFFFFF" 
                      }}
                      activeDot={{ 
                        r: isMobile ? 6 : 7, 
                        fill: "#10B981",
                        strokeWidth: 2,
                        stroke: "#FFFFFF"
                      }}
                      name="New customers"
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                    <Line
                      type="monotone"
                      dataKey="returningCustomers"
                      stroke="#6366F1"
                      strokeWidth={isMobile ? 2.5 : 3}
                      dot={{ 
                        r: isMobile ? 4 : 5, 
                        fill: "#6366F1", 
                        strokeWidth: 2, 
                        stroke: "#FFFFFF" 
                      }}
                      activeDot={{ 
                        r: isMobile ? 6 : 7, 
                        fill: "#6366F1",
                        strokeWidth: 2,
                        stroke: "#FFFFFF"
                      }}
                      name="Returning customers"
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          {/* 3D PIE CHART - DEPARTMENT DISTRIBUTION */}
          <section className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-500">Employee Distribution</p>
                <p className="text-[0.65rem] sm:text-xs text-gray-500 mt-1">Department-wise workforce allocation across Pravara Health Care</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="mt-2 sm:mt-0 rounded-full border border-blue-200 bg-blue-50 px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
                  Total: {totalEmployees} Employees
                </span>
                {selectedDept && (
                  <span 
                    className="mt-2 sm:mt-0 rounded-full px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-xs font-semibold text-white whitespace-nowrap transition-all"
                    style={{ backgroundColor: selectedDept.color }}
                  >
                    {selectedDept.name}: {selectedDept.employees} ({selectedDept.value}%)
                  </span>
                )}
              </div>
            </div>

            <div className="relative w-full">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                {/* Pie Chart with Center Info - Sticky on Desktop */}
                <div className="relative flex-shrink-0 lg:sticky lg:top-6 lg:self-start" style={{ width: isMobile ? '100%' : '450px', height: isMobile ? '350px' : '450px', maxWidth: isMobile ? '100%' : '450px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {departmentDistribution.map((item, index) => (
                          <g key={`defs-${index}`}>
                            <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                              <stop offset="100%" stopColor={item.color} stopOpacity={0.7} />
                            </linearGradient>
                            <filter id={`glow-${index}`}>
                              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </g>
                        ))}
                      </defs>
                      <Pie
                        data={departmentDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={isMobile ? 110 : 150}
                        innerRadius={isMobile ? 50 : 80}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={3}
                        animationDuration={2000}
                        animationEasing="ease-out"
                        onClick={handlePieClick}
                        activeIndex={activeIndex}
                        activeShape={{
                          outerRadius: isMobile ? 120 : 165,
                          innerRadius: isMobile ? 45 : 75,
                        }}
                      >
                        {departmentDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#gradient-${index})`}
                            stroke={entry.color}
                            strokeWidth={activeIndex === index ? 4 : 2}
                            style={{
                              filter: activeIndex === index ? `url(#glow-${index})` : 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload[0]) return null;
                          const dept = departmentDistribution.find(d => d.value === payload[0].value);
                          if (!dept) return null;
                          
                          return (
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl" style={{ minWidth: "220px" }}>
                              <div className="space-y-3">
                                <div className="font-semibold text-lg border-b border-gray-200 pb-2" style={{ color: dept.color }}>
                                  {dept.name}
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600">Percentage:</span>
                                    <span className="font-semibold text-gray-900">{dept.value}%</span>
                                  </div>
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600">Employees:</span>
                                    <span className="font-semibold text-gray-900">{dept.employees}</span>
                                  </div>
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600">Avg. Salary:</span>
                                    <span className="font-semibold text-gray-900">{dept.avgSalary}</span>
                                  </div>
                                  <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-600">Growth:</span>
                                    <span className="font-semibold text-emerald-600">{dept.growth}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center Information Display */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      {selectedDept ? (
                        <div className="space-y-1">
                          <div className="text-2xl sm:text-3xl font-bold" style={{ color: selectedDept.color }}>
                            {selectedDept.value}%
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-700">
                            {selectedDept.name}
                          </div>
                          <div className="text-[0.65rem] sm:text-xs text-gray-500">
                            {selectedDept.employees} Employees
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                            {totalEmployees}
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Total Employees
                          </div>
                          <div className="text-[0.65rem] sm:text-xs text-gray-500">
                            Click segment for details
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Callout Boxes with Connecting Lines */}
                <div className="relative flex-1 w-full lg:min-w-0 lg:max-w-full">
                  {/* SVG Container for connecting lines (desktop only) */}
                  <svg
                    className="absolute hidden lg:block pointer-events-none overflow-visible"
                    style={{
                      left: '-200px',
                      top: '50%',
                      width: '600px',
                      height: '400px',
                      transform: 'translateY(-50%)',
                      zIndex: 0,
                    }}
                  >
                    {departmentDistribution.map((dept, index) => {
                      const totalAngle = 360;
                      const startAngle = 90;
                      const cumulativeAngle = departmentDistribution
                        .slice(0, index)
                        .reduce((sum, item) => sum + (item.value / 100) * totalAngle, 0);
                      const midAngle = startAngle - cumulativeAngle - (dept.value / 100) * totalAngle / 2;
                      const angleRad = (midAngle * Math.PI) / 180;
                      const radius = 130;
                      const x1 = 200 + Math.cos(angleRad) * radius;
                      const y1 = 200 + Math.sin(angleRad) * radius;
                      const x2 = 400;
                      const y2 = 50 + index * 80;
                      
                      return (
                        <line
                          key={`line-${index}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={dept.color}
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          opacity="0.5"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Callout Boxes - Scrollable Container */}
                  <div className="relative z-10 w-full lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:overflow-x-visible lg:pr-4 lg:pl-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:pb-6 lg:pt-2 min-w-0">
                      {departmentDistribution.map((dept, index) => (
                      <div
                        key={dept.name}
                        onClick={() => handleDeptClick(dept, index)}
                        className={`group relative rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer w-full min-w-0 ${
                          activeIndex === index 
                            ? 'shadow-xl ring-2 ring-offset-2' 
                            : 'hover:shadow-lg'
                        }`}
                        style={{
                          borderColor: dept.color,
                          backgroundColor: activeIndex === index ? `${dept.color}25` : `${dept.color}15`,
                          ringColor: dept.color,
                          transform: activeIndex === index ? 'translateY(-2px)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                          if (activeIndex !== index) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeIndex !== index) {
                            e.currentTarget.style.transform = 'none';
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex-shrink-0 rounded-lg p-2.5 transition-transform duration-300 group-hover:scale-105"
                            style={{
                              backgroundColor: `${dept.color}25`,
                              color: dept.color,
                            }}
                          >
                            {dept.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900">{dept.name}</h3>
                              <span
                                className="text-base sm:text-lg font-bold whitespace-nowrap px-2 py-0.5 rounded-md"
                                style={{ 
                                  color: dept.color,
                                  backgroundColor: `${dept.color}20`,
                                }}
                              >
                                {dept.value}%
                              </span>
                            </div>
                            <p className="text-[0.65rem] sm:text-xs text-gray-600 leading-relaxed mb-2">
                              {dept.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Employees</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{dept.employees}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Avg. Salary</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{dept.avgSalary}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Growth</p>
                                <p className="text-xs sm:text-sm font-semibold text-emerald-600">{dept.growth}</p>
                              </div>
                              <div>
                                <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider mb-0.5">Share</p>
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">{dept.value}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RETENTION + ACTION CENTER */}
          <section className="grid gap-6 grid-cols-1 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-500">Customer Retention</p>
                  <p className="text-[0.65rem] sm:text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <span className="mt-2 sm:mt-3 rounded-full border border-blue-200 bg-blue-50 px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
                  87% avg retention
                </span>
              </div>

              <div className="mt-4 sm:mt-6 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-1.5 sm:border-spacing-2">
                      <thead>
                        <tr>
                          <th className="sticky left-0 z-10 bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-left text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-500">Month</th>
                          {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"].map((label) => (
                            <th key={label} className="px-1.5 sm:px-3 py-1.5 sm:py-2 text-center text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-500 whitespace-nowrap">
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {retentionMatrix.map((row) => (
                          <tr key={row.month}>
                            <td className="sticky left-0 z-10 bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm font-semibold text-gray-900">{row.month}</td>
                            {row.cohorts.map((value, idx) => {
                              const colorIndex = idx % retentionEmployeeColors.length;
                              const color = retentionEmployeeColors[colorIndex];
                              const bgColor = `${color}15`; // 15% opacity
                              const borderColor = `${color}40`; // 40% opacity
                              const textColor = color;
                              
                              return (
                                <td key={`${row.month}-${idx}`} className="px-1 sm:px-1.5 py-1 sm:py-1.5 text-center">
                                  <div 
                                    className="rounded-md sm:rounded-lg px-1.5 sm:px-2 py-1.5 sm:py-2.5 text-[0.65rem] sm:text-xs font-semibold whitespace-nowrap"
                                    style={{
                                      backgroundColor: bgColor,
                                      borderColor: borderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: textColor,
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
              </div>

              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 text-[0.65rem] sm:text-xs">
                {retentionLegend.map((item, idx) => {
                  const colorIndex = idx % retentionEmployeeColors.length;
                  const color = retentionEmployeeColors[colorIndex];
                  
                  return (
                    <span key={item.label} className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white px-2 sm:px-3 py-1 text-gray-600">
                      <span 
                        className="h-1.5 sm:h-2 w-4 sm:w-6 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </span>
                  );
                })}
              </div>
            </article>

            <article className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-500">Action Center</p>
                  <p className="mt-1 text-[0.65rem] sm:text-xs text-gray-500 break-words">Keep momentum high with these next steps</p>
                </div>
                <span className="self-start sm:self-auto rounded-full border border-blue-200 bg-blue-50 px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">3 open</span>
              </div>

              <ul className="space-y-2.5 sm:space-y-3 flex-1">
                {actionItems.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3"
                  >
                    <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">{item.title}</p>
                    <div className="mt-2 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-0 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500">
                      <span className="break-words">{item.owner}</span>
                      <span className="whitespace-nowrap">{item.due}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <button className="mt-2 sm:mt-auto w-full sm:w-auto rounded-md border border-blue-600 px-4 py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 transition-colors">
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
