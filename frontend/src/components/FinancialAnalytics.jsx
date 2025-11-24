import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const monthlySummary = [
  { month: "Jan", income: 38.5, expense: 32.1 },
  { month: "Feb", income: 40.2, expense: 33.6 },
  { month: "Mar", income: 42.8, expense: 34.9 },
  { month: "Apr", income: 44.4, expense: 36.8 },
  { month: "May", income: 39.8, expense: 37.2 },
  { month: "Jun", income: 45.6, expense: 38.8 },
  { month: "Jul", income: 47.1, expense: 39.4 },
  { month: "Aug", income: 49.3, expense: 40.2 },
  { month: "Sep", income: 48.7, expense: 41.1 },
  { month: "Oct", income: 51.2, expense: 42.3 },
  { month: "Nov", income: 52.4, expense: 43.5 },
  { month: "Dec", income: 54.1, expense: 44.9 },
];

const incomeBreakdown = [
  { label: "Salary", value: 142000 },
  { label: "Business", value: 168000 },
  { label: "Investment", value: 74500 },
];

const getExpenseIcon = (name) => {
  const icons = {
    Housing: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    Transportation: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-9 5.25v-1.875c0-.621-.504-1.125-1.125-1.125H4.125c-.621 0-1.125.504-1.125 1.125v1.875m15.75 0v-1.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v1.875m-15.75 0h15.75" />
      </svg>
    ),
    Entertainment: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 1 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.546 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
      </svg>
    ),
    Food: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 7.51 6 8.473 6 9.708v2.292m6-4.5V8.25m6 4.5v-2.292c0-1.235-.845-2.198-1.976-2.542a48.019 48.019 0 0 0-1.897-.124c1.14.236 2.122.603 2.873 1.08M12 8.25h.008v.008H12V8.25Zm3 12h-6v-1.5c0-1.355.056-2.697.166-4.024C9.845 15.99 9 15.027 9 13.792V11.5m6 10.5v-1.5c0-1.355-.056-2.697-.166-4.024C14.845 15.99 15 15.027 15 13.792V11.5m-6 0c-1.355 0-2.697-.056-4.024-.166C4.845 11.49 4 10.527 4 9.292V7.04m6 4.5v6m6-6v6" />
      </svg>
    ),
    Other: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  };
  return icons[name] || icons.Other;
};

const expenseBreakdown = [
  { 
    name: "Housing", 
    value: 40, 
    amount: "₹1,31,577",
    color: "#F59E0B",
    growth: "+5.2%",
    description: "Rent, utilities, maintenance, and property-related expenses.",
  },
  { 
    name: "Transportation", 
    value: 25, 
    amount: "₹82,236",
    color: "#DC2626",
    growth: "+12.8%",
    description: "Vehicle costs, fuel, public transport, and commuting expenses.",
  },
  { 
    name: "Entertainment", 
    value: 20, 
    amount: "₹65,789",
    color: "#84CC16",
    growth: "+18.5%",
    description: "Leisure activities, dining out, subscriptions, and entertainment.",
  },
  { 
    name: "Food", 
    value: 10, 
    amount: "₹32,894",
    color: "#06B6D4",
    growth: "+8.3%",
    description: "Groceries, dining, food delivery, and household consumables.",
  },
  { 
    name: "Other", 
    value: 5, 
    amount: "₹16,447",
    color: "#6B7280",
    growth: "+3.1%",
    description: "Miscellaneous expenses, insurance, and other categories.",
  },
];

const forecastData = [
  { month: "Jan", income: 36, expense: 31, net: 5 },
  { month: "Feb", income: 38, expense: 32, net: 6 },
  { month: "Mar", income: 41, expense: 34, net: 7 },
  { month: "Apr", income: 44, expense: 35, net: 9 },
  { month: "May", income: 39, expense: 37, net: 2 },
  { month: "Jun", income: 46, expense: 38, net: 8 },
  { month: "Jul", income: 48, expense: 39, net: 9 },
  { month: "Aug", income: 50, expense: 41, net: 9 },
];

const metricCards = [
  { title: "Total Income", value: 384567.45, change: "+8.7%", bgColor: "#FEF3C7", textColor: "#F59E0B" },
  { title: "Total Expenses", value: 328942.6, change: "-6.3%", bgColor: "#FEE2E2", textColor: "#EF4444" },
  { title: "Total Net Income", value: 55624.85, change: "+21.4%", bgColor: "#D1FAE5", textColor: "#10B981" },
];

const incomeTotal = incomeBreakdown.reduce((sum, item) => sum + item.value, 0);
const expenseTotal = expenseBreakdown.reduce((sum, item) => {
  const amount = parseFloat(item.amount.replace(/[₹,]/g, ''));
  return sum + amount;
}, 0);
const expenseTotalTransactions = 130;
const formatCurrency = (amount) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function FinancialAnalytics() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeExpenseIndex, setActiveExpenseIndex] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleExpenseClick = (data, index) => {
    setActiveExpenseIndex(index);
    setSelectedExpense(data);
  };

  const handleExpenseBoxClick = (expense, index) => {
    setActiveExpenseIndex(index);
    setSelectedExpense(expense);
  };
  return (
    <section className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      <header className="flex flex-col gap-2 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold  tracking-[0.05em] text-gray-500">Analytics · Summary</p>
          <h2 className="mt-1 text-xl font-semibold sm:text-2xl">Financial analytics</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[0.65rem] font-medium">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-700">All accounts</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-700">Monthly</span>
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-700">2024</span>
        </div>
      </header>

      <div className="grid gap-4 px-4 py-4 lg:grid-cols-[2.1fr_0.9fr]">
        <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <h3 className="text-xs sm:text-sm font-semibold  tracking-[0.05em] text-gray-500">Monthly Income & Expenses</h3>
              <p className="text-[0.65rem] sm:text-xs text-gray-500">Income vs expenses · Jan - Dec 2024</p>
            </div>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 sm:px-3 py-1 text-[0.65rem] sm:text-xs font-semibold text-blue-700 whitespace-nowrap">
              Annual View
            </span>
          </div>
          <div className="mt-4 h-56 sm:h-64 md:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlySummary} 
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
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                    <stop offset="50%" stopColor="#A78BFA" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                    <stop offset="50%" stopColor="#34D399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.8} />
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
                  tickFormatter={(value) => `₹${value}L`}
                  axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  tickLine={{ stroke: "#E5E7EB" }}
                  width={isMobile ? 45 : 60}
                />
                <Tooltip
                  cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                  labelFormatter={(label) => `Month: ${label} 2024`}
                  formatter={(value, name) => {
                    const formattedValue = `₹${Number(value).toFixed(2)}L`;
                    const netValue = name === "income" 
                      ? (value - monthlySummary.find(m => m.month === label)?.expense || 0).toFixed(2)
                      : null;
                    return [
                      <div key="tooltip" className="space-y-1">
                        <div className={`font-semibold ${name === "income" ? "text-purple-600" : "text-emerald-600"}`}>
                          {formattedValue}
                        </div>
                        {netValue && (
                          <div className="text-xs text-gray-500">Net: ₹{netValue}L</div>
                        )}
                      </div>,
                      name === "income" ? "Income" : "Expenses"
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
                  dataKey="income" 
                  name="Income" 
                  fill="url(#incomeGradient)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Bar 
                  dataKey="expense" 
                  name="Expenses" 
                  fill="url(#expenseGradient)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="grid gap-3">
          {metricCards.map((card) => (
            <div 
              key={card.title} 
              className="rounded-xl border border-gray-200 p-3 sm:p-4"
              style={{ backgroundColor: card.bgColor }}
            >
              <p className="text-[0.6rem] font-medium  tracking-[0.05em] text-gray-500 sm:text-xs">{card.title}</p>
              <p 
                className="mt-2 text-xl font-semibold sm:text-2xl"
                style={{ color: card.textColor }}
              >
                {formatCurrency(card.value)}
              </p>
              <p className="mt-1 text-[0.65rem] font-medium text-gray-600 sm:text-xs">{card.change}</p>
            </div>
          ))}
        </aside>
      </div>

      <div className="grid gap-4 border-t border-gray-200 px-4 py-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-semibold  tracking-[0.05em] text-gray-500">Income Overview</h3>
            <span className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-[0.6rem] sm:text-xs  tracking-[0.05em] text-purple-700">
              3 Sources
            </span>
          </div>
          <div className="mb-4">
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{formatCurrency(incomeTotal)}</p>
            <p className="text-[0.65rem] sm:text-xs text-gray-500 mt-1">Total Annual Income</p>
          </div>
          <div className="mt-4 space-y-3">
            {incomeBreakdown.map((item, index) => {
              const percentage = Math.round((item.value / incomeTotal) * 100);
              const colors = ["#8B5CF6", "#A78BFA", "#10B981"];
              const color = colors[index % colors.length];
              return (
                <div 
                  key={item.label} 
                  className="group space-y-2 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">{item.label}</span>
                    </div>
                    <span className="font-bold text-xs sm:text-sm" style={{ color: color }}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{formatCurrency(item.value)}</span>
                    <span className="font-medium text-gray-500">{percentage}% of total</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 relative"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}60`,
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${color} 0%, ${color}CC 50%, ${color} 100%)`,
                          animation: 'shimmer 2s infinite'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-semibold  tracking-[0.05em] text-gray-500">Expense Analysis</h3>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[0.6rem] sm:text-xs  tracking-[0.05em] text-gray-700">
              {expenseTotalTransactions} Transactions
            </span>
          </div>
          <div className="mt-4 h-48 sm:h-56 md:h-64 overflow-visible relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {expenseBreakdown.map((item, index) => (
                    <g key={`expense-defs-${index}`}>
                      <linearGradient id={`expense-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={item.color} stopOpacity={0.7} />
                      </linearGradient>
                      <filter id={`expense-glow-${index}`}>
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </g>
                  ))}
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload[0]) return null;
                    const item = expenseBreakdown.find(d => d.value === payload[0].value);
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
                              <span className="text-gray-600">Amount:</span>
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
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 45 : 70}
                  outerRadius={isMobile ? 90 : 120}
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={3}
                  onClick={handleExpenseClick}
                  activeIndex={activeExpenseIndex}
                  activeShape={{
                    outerRadius: isMobile ? 100 : 135,
                    innerRadius: isMobile ? 40 : 65,
                  }}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell 
                      key={entry.name} 
                      fill={`url(#expense-gradient-${index})`}
                      stroke={entry.color}
                      strokeWidth={activeExpenseIndex === index ? 4 : 2}
                      style={{
                        filter: activeExpenseIndex === index ? `url(#expense-glow-${index})` : 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Pie>
                <text 
                  x="50%" 
                  y="50%" 
                  dominantBaseline="middle" 
                  textAnchor="middle" 
                  fill="#111827" 
                  fontSize={isMobile ? 12 : 20} 
                  fontWeight="600"
                >
                  {selectedExpense ? (
                    <tspan x="50%" dy="0">{selectedExpense.value}%</tspan>
                  ) : (
                    <>
                      <tspan x="50%" dy={isMobile ? "-0.3em" : "-0.5em"} fontSize={isMobile ? 12 : 20}>{formatCurrency(expenseTotal)}</tspan>
                      <tspan x="50%" dy={isMobile ? "1em" : "1.2em"} fontSize={isMobile ? 8 : 12} fill="#6B7280" fontWeight="500">Total</tspan>
                    </>
                  )}
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-1.5 text-[0.65rem] sm:text-xs">
            {expenseBreakdown.map((item, index) => (
              <div 
                key={item.name} 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                  activeExpenseIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleExpenseBoxClick(item, index)}
              >
                <span className="inline-flex items-center gap-2">
                  <span 
                    className="h-2.5 w-2.5 rounded-full" 
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: activeExpenseIndex === index ? `0 0 0 2px ${item.color}40` : 'none'
                    }} 
                  />
                  <span className="font-medium">{item.name}</span>
                </span>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs sm:text-sm font-semibold  tracking-[0.05em] text-gray-500">Financial Forecast</h3>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[0.6rem] sm:text-xs  tracking-[0.05em] text-blue-700">
              8-Month Projection
            </span>
          </div>
          <div className="mt-4 h-48 sm:h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={forecastData} 
                margin={{ 
                  top: 20, 
                  right: 20, 
                  left: isMobile ? -10 : 0, 
                  bottom: isMobile ? 5 : 10 
                }}
              >
                <defs>
                  <linearGradient id="forecastIncomeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                    <stop offset="50%" stopColor="#A78BFA" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="forecastExpenseBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                    <stop offset="50%" stopColor="#34D399" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="netIncomeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                    <stop offset="50%" stopColor="#FBBF24" stopOpacity={1} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={1} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid 
                  stroke="rgba(99, 102, 241, 0.1)" 
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
                  yAxisId="left"
                  stroke="#9CA3AF" 
                  tick={{ 
                    fill: "#6B7280", 
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 500
                  }}
                  tickFormatter={(value) => `₹${value}L`}
                  axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  tickLine={{ stroke: "#E5E7EB" }}
                  width={isMobile ? 45 : 60}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#9CA3AF" 
                  tick={{ 
                    fill: "#6B7280", 
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 500
                  }}
                  tickFormatter={(value) => `₹${value}L`}
                  axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  tickLine={{ stroke: "#E5E7EB" }}
                  width={isMobile ? 45 : 60}
                />
                <Tooltip
                  cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                  labelFormatter={(label) => `Month: ${label}`}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const monthData = forecastData.find(d => d.month === label);
                    const net = monthData ? monthData.net : 0;
                    
                    return (
                      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl" style={{ minWidth: "220px" }}>
                        <div className="space-y-2">
                          <div className="font-semibold text-sm border-b border-gray-200 pb-2 text-gray-900">
                            Month: {label}
                          </div>
                          {payload.map((entry, index) => {
                            if (entry.dataKey === 'net') return null;
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
                                    ₹{Number(entry.value).toFixed(1)}L
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Net Income:</span>
                              <span className={`text-sm font-semibold ${net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                ₹{net.toFixed(1)}L
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend 
                  verticalAlign="top"
                  align="right"
                  iconType="rect" 
                  wrapperStyle={{ 
                    color: "#111827", 
                    fontSize: "12px", 
                    paddingBottom: 12 
                  }} 
                />
                <ReferenceLine 
                  yAxisId="right"
                  y={0} 
                  stroke="#6B7280" 
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  strokeOpacity={0.5}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="income" 
                  name="Income" 
                  fill="url(#forecastIncomeBarGradient)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  barSize={isMobile ? 20 : 28}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="expense" 
                  name="Expenses" 
                  fill="url(#forecastExpenseBarGradient)" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  barSize={isMobile ? 20 : 28}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="net" 
                  name="Net Income" 
                  stroke="url(#netIncomeGradient)" 
                  strokeWidth={isMobile ? 3 : 4}
                  dot={{ 
                    fill: "#F59E0B", 
                    r: isMobile ? 5 : 6, 
                    strokeWidth: 3, 
                    stroke: "#FFFFFF",
                    filter: "url(#glow)"
                  }}
                  activeDot={{ 
                    r: isMobile ? 7 : 8, 
                    fill: "#F59E0B",
                    strokeWidth: 3,
                    stroke: "#FFFFFF",
                    filter: "url(#glow)"
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            {forecastData.slice(-3).map((item, idx) => {
              const netColor = item.net >= 0 ? 'text-emerald-600' : 'text-red-600';
              const bgColor = item.net >= 0 ? 'bg-emerald-50' : 'bg-red-50';
              return (
                <div key={idx} className={`rounded-lg p-2 sm:p-3 ${bgColor} border border-gray-200`}>
                  <p className="text-[0.6rem] font-medium text-gray-600 sm:text-xs">{item.month}</p>
                  <p className={`mt-1 text-sm font-bold sm:text-base ${netColor}`}>
                    ₹{item.net.toFixed(1)}L
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-[0.65rem] sm:text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">Forecast Alert:</span> Expecting potential deficit in May. Consider saving more in April or optimizing leisure expenses to maintain positive cash flow.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

