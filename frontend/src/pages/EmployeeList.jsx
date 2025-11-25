import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Cell, Funnel, FunnelChart, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// KPI Cards for Hiring Dashboard - matching Dashboard.jsx style with different colors
const kpiCards = [
  {
    title: "Hiring Rate",
    value: "2.1%",
    helper: "+0.6pp vs last month",
    badge: "Healthy",
    color: "#EC4899", // Pink
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.375 21c-2.331 0-4.512-.645-6.375-1.765Z" />
      </svg>
    ),
  },
  {
    title: "Days to Hire",
    value: "5 Days",
    helper: "-2 days vs last month",
    badge: "Improving",
    color: "#6366F1", // Indigo
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Cost Per Hire",
    value: "₹1,400",
    helper: "+₹120 vs budget",
    badge: "On Track",
    color: "#14B8A6", // Teal
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    title: "Open Positions",
    value: "5",
    helper: "2 critical roles",
    badge: "Active",
    color: "#F97316", // Orange
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.25m0 0h4.5m-4.5 0-3 3m3-3 3-3m-3 3h4.5m0 0v4.25a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.25" />
      </svg>
    ),
  },
];

const overviewStats = [
  {
    label: "Hired",
    value: "2",
    subtitle: "Offers accepted this month",
    change: "+1 vs July",
    changeTone: "text-[#A020F0]",
    gradient: "from-[#A020F0]/20 via-[#D400FF]/20 to-[#FF00CC]/20",
    progress: 45,
    progressColor: "bg-[#A020F0]",
    progressLabel: "45% of quarterly target",
  },
  {
    label: "Apps Per Hire",
    value: "2.1",
    subtitle: "Quality of applicant pipeline",
    change: "-0.4 vs benchmark",
    changeTone: "text-[#D400FF]",
    gradient: "from-[#D400FF]/20 via-[#FF00CC]/20 to-[#A020F0]/20",
    progress: 65,
    progressColor: "bg-[#D400FF]",
    progressLabel: "Pipeline health 65%",
  },
  {
    label: "Days to Hire",
    value: "5",
    subtitle: "Average time from application",
    change: "-2 days vs last month",
    changeTone: "text-[#A020F0]",
    gradient: "from-[#A020F0]/20 via-[#D400FF]/20 to-[#FF00CC]/20",
    progress: 72,
    progressColor: "bg-[#A020F0]",
    progressLabel: "Service-level 72%",
  },
  {
    label: "Cost Per Hire",
    value: "₹1400",
    subtitle: "Recruiting spend per hire",
    change: "+₹120 vs budget",
    changeTone: "text-[#FF00CC]",
    gradient: "from-[#FF00CC]/20 via-[#A020F0]/20 to-[#D400FF]/20",
    progress: 58,
    progressColor: "bg-[#FF00CC]",
    progressLabel: "Budget used 58%",
  },
  {
    label: "Open Positions",
    value: "5",
    subtitle: "Roles awaiting final interviews",
    change: "2 critical",
    changeTone: "text-[#D400FF]",
    gradient: "from-[#D400FF]/20 via-[#A020F0]/20 to-[#FF00CC]/20",
    progress: 33,
    progressColor: "bg-[#D400FF]",
    progressLabel: "Critical roles 33%",
  },
  {
    label: "Days in Market",
    value: "6",
    subtitle: "Average posting visibility",
    change: "+1 day vs goal",
    changeTone: "text-[#FF00CC]",
    gradient: "from-[#FF00CC]/20 via-[#D400FF]/20 to-[#A020F0]/20",
    progress: 52,
    progressColor: "bg-[#FF00CC]",
    progressLabel: "Exposure 52%",
  },
];

const monthlyMetrics = [
  { month: "May 2021", hired: "0", daysToHire: "-", status: "Planning", statusTone: "bg-[#A020F0]/20 text-[#A020F0]" },
  { month: "June 2021", hired: "0", daysToHire: "-", status: "Sourcing", statusTone: "bg-[#D400FF]/20 text-[#D400FF]" },
  { month: "July 2021", hired: "1", daysToHire: "6", status: "Filled", statusTone: "bg-[#A020F0]/20 text-[#A020F0]" },
  { month: "August 2021", hired: "x", daysToHire: "x", status: "In progress", statusTone: "bg-[#FF00CC]/20 text-[#FF00CC]" },
];

const funnelData = [
  { name: "Application", value: 100 },
  { name: "Phone Screen", value: 85 },
  { name: "MGR Interview", value: 75 },
  { name: "Onsite Interview", value: 65 },
  { name: "Offer", value: 55 },
  { name: "Hire", value: 45 },
];

const funnelColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

const funnelInsights = [
  { stage: "Application → Phone Screen", drop: "15% drop", note: "Automated acknowledgement reduced wait time" },
  { stage: "Phone Screen → MGR Interview", drop: "10% drop", note: "Hiring manager capacity improving week-on-week" },
  { stage: "Onsite → Offer", drop: "10% drop", note: "Offer alignment workshop scheduled for next sprint" },
];

const pipelineData = [
  { name: "Application", value: 17, description: "Resume review within 24 hrs" },
  { name: "Phone Screen", value: 17, description: "Initial HR screening" },
  { name: "MGR Interview", value: 17, description: "Panel of hiring leads" },
  { name: "Onsite Interview", value: 17, description: "Clinical simulation" },
  { name: "Offer", value: 17, description: "Compensation negotiation" },
  { name: "Hire", value: 17, description: "Background & onboarding" },
];

const pipelineColors = ["#F59E0B", "#DC2626", "#84CC16", "#06B6D4", "#6B7280"];

const highlightCards = [
  {
    title: "Sourcing Channel",
    value: "Employee referrals",
    description: "Accounts for 55% of qualified applications with the lowest churn.",
    color: "bg-[#A020F0]",
  },
  {
    title: "Urgent Role",
    value: "ICU Nurse (Night Shift)",
    description: "3 offers outstanding, final interviews scheduled this week.",
    color: "bg-[#FF00CC]",
  },
  {
    title: "Diversity Goal",
    value: "58% female hires",
    description: "On track to meet quarterly objective with current pipeline mix.",
    color: "bg-[#D400FF]",
  },
  {
    title: "Retention Rate",
    value: "92%",
    description: "High employee satisfaction and retention across all departments.",
    color: "bg-[#10B981]",
  },
];

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl grow overflow-hidden px-3 py-6 sm:px-4 sm:py-8 lg:px-6 xl:px-8">
        <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 sm:gap-8 sm:p-6 lg:p-8" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 sm:px-3 sm:py-1 text-[0.65rem] sm:text-xs font-semibold  tracking-[0.05em] text-gray-500">
              Overview
            </p>
            <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-3xl font-bold">
              Monthly Hiring Dashboard with Recruitment Funnel
            </h1>
          </div>
          <p className="self-start rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-blue-700">
            August 2021
          </p>
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
                  className="absolute right-0 top-0 pointer-events-none"
                  style={{
                    transform: 'translate(15%, -15%)',
                    opacity: 0.2,
                  }}
                >
                  {React.cloneElement(card.icon, {
                    className: 'h-20 w-20 sm:h-32 sm:w-32',
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
                    className="text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2 transition-opacity duration-300"
                    style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'" }}
                  >
                    {card.title}
                  </h2>
                  <p 
                    className="text-xs sm:text-sm font-normal text-white/80 flex items-center gap-1 transition-transform duration-300" 
                    style={{ 
                      letterSpacing: '0',
                      fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'"
                    }}
                  >
                    <span className="transition-transform duration-300 hover:scale-125">{card.helper.includes('+') || card.helper.includes('-') ? (card.helper.includes('+') ? '↑' : '↓') : ''}</span>
                    {card.helper}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overviewStats.map((stat) => (
            <article
              key={stat.label}
              className={`group flex flex-col justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-3 sm:p-4 transition shadow-sm hover:shadow-md`}
              style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'", boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
            >
              <header className="flex items-center justify-between mb-2">
                <p className="text-[0.65rem] sm:text-xs font-bold tracking-[0.05em] text-gray-700" style={{ letterSpacing: '-0.02em' }}>{stat.label}</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-1.5 py-0.5 text-[0.55rem] sm:text-[0.6rem] font-semibold text-gray-800 transition" style={{ letterSpacing: '-0.02em' }}>
                  {stat.change}
                </span>
              </header>
              <div className="mb-3">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1" style={{ letterSpacing: '-0.03em' }}>{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-600" style={{ letterSpacing: '-0.01em' }}>{stat.subtitle}</p>
              </div>
              <div className="mt-auto">
                <div className="h-1.5 sm:h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${stat.progress}%` }} />
                </div>
                <p className={`mt-1.5 text-[0.65rem] sm:text-xs font-semibold text-emerald-700`} style={{ letterSpacing: '-0.01em' }}>{stat.progressLabel}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
            <h2 className="text-base sm:text-lg font-bold text-black">Monthly Metrics</h2>
            <div className="mt-3 sm:mt-4 -mx-2 overflow-x-auto sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 text-[0.65rem] sm:text-xs font-semibold  tracking-[0.05em] text-gray-500">
                  <tr>
                    <th className="px-2 py-2 sm:px-4 sm:py-3">Month</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Hired</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Days to Hire</th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyMetrics.map((row, index) => (
                    <tr
                      key={row.month}
                      className="bg-white"
                    >
                      <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-xs sm:text-sm">{row.month}</td>
                      <td
                        className={`px-2 py-2 sm:px-4 sm:py-3 text-center text-sm sm:text-base font-semibold ${
                          row.hired === "1" ? "text-indigo-600" : "text-gray-900"
                        }`}
                      >
                        {row.hired}
                      </td>
                      <td
                        className={`px-2 py-2 sm:px-4 sm:py-3 text-center text-sm sm:text-base font-semibold ${
                          row.daysToHire === "6" ? "text-indigo-600" : "text-gray-900"
                        }`}
                      >
                        {row.daysToHire}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 sm:px-3 sm:py-1 text-[0.6rem] sm:text-[0.65rem] font-semibold  tracking-[0.05em] text-gray-700">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
            <h2 className="text-base sm:text-lg font-bold text-black">Recruitment Funnel</h2>
            <div className="mt-3 sm:mt-4 h-56 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip 
                    formatter={(value) => `${value}%`} 
                    contentStyle={{ 
                      backgroundColor: "#FFFFFF", 
                      borderColor: "#E5E7EB", 
                      borderRadius: "12px", 
                      color: "#111827",
                      fontSize: isMobile ? '12px' : '14px'
                    }} 
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive={false}
                    fill="#A020F0"
                    stroke="none"
                  >
                    {funnelData.map((entry, index) => (
                      <Cell key={entry.name} fill={funnelColors[index]} />
                    ))}
                    <LabelList
                      position="right"
                      fill="#111827"
                      stroke="none"
                      dataKey="name"
                      formatter={(value, entry) => (entry?.name ? entry.name : value ?? "")}
                      style={{ fontSize: isMobile ? '10px' : '12px' }}
                    />
                    <LabelList
                      position="inside"
                      fill="#111827"
                      stroke="none"
                      dataKey="value"
                      formatter={(value) => (value !== undefined ? `${value}%` : "")}
                      style={{ fontSize: isMobile ? '10px' : '12px', fontWeight: 'bold' }}
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {funnelInsights.map((item, index) => (
                <li key={item.stage} className="rounded-lg border border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-3">
                  <p className="text-[0.65rem] sm:text-xs font-bold  tracking-[0.05em] text-gray-500">{item.stage}</p>
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                    <span className="font-semibold" style={{ color: funnelColors[index % funnelColors.length] }}>{item.drop}</span>
                    <span className="text-gray-600">{item.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-6" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}>
            <h2 className="text-base sm:text-lg font-bold text-black">Pipeline Efficiency of Hiring</h2>
            <p className="mt-1 text-[0.65rem] sm:text-xs font-medium  tracking-[0.05em] text-gray-500">
              Days taken for each stage in recruitment process
            </p>
            <div className="mt-2 h-56 sm:h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip 
                    formatter={(value) => `${value}%`} 
                    contentStyle={{ 
                      backgroundColor: "#FFFFFF", 
                      borderColor: "#E5E7EB", 
                      borderRadius: "12px", 
                      color: "#111827",
                      fontSize: isMobile ? '12px' : '14px'
                    }} 
                  />
                  <Pie
                    data={pipelineData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? "50%" : "55%"}
                    outerRadius={isMobile ? "85%" : "90%"}
                    stroke="none"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={entry.name} fill={pipelineColors[index % pipelineColors.length]} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-900 text-xl sm:text-2xl font-semibold"
                  >
                    100%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 sm:mt-4 grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm sm:grid-cols-2">
              {pipelineData.map((stage, index) => (
                <li
                  key={stage.name}
                  className="flex items-start gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 sm:px-3.5 sm:py-3"
                  style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
                >
                  <span
                    className="mt-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                    style={{ 
                      backgroundColor: pipelineColors[index % pipelineColors.length],
                      boxShadow: `0 0 0 2px ${pipelineColors[index % pipelineColors.length]}40`
                    }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold">{stage.name}</p>
                    <p className="text-[0.65rem] sm:text-xs text-gray-500">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {highlightCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col gap-1 sm:gap-1.5 lg:gap-3 rounded-lg border border-gray-200 bg-white p-2 sm:p-2.5 lg:p-4 xl:p-6"
              style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)' }}
            >
              <span className={`inline-flex w-max items-center rounded-full border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 sm:px-2 sm:py-0.5 lg:px-3 lg:py-1 text-[0.5rem] sm:text-[0.65rem] lg:text-xs font-semibold  tracking-[0.15em] sm:tracking-[0.05em] text-indigo-700 leading-tight`}>
                {card.title}
              </span>
              <p className={`${card.title === "Sourcing Channel" ? "text-[0.7rem] sm:text-base lg:text-lg" : "text-xs sm:text-base lg:text-lg"} font-semibold leading-tight break-words`}>{card.value}</p>
              <p className={`${card.title === "Sourcing Channel" ? "text-[0.55rem] sm:text-xs lg:text-sm" : "text-[0.6rem] sm:text-xs lg:text-sm"} text-gray-600 leading-tight break-words line-clamp-2`}>{card.description}</p>
            </article>
          ))}
        </section>

          <p className="mt-4 text-center text-xs text-gray-500">
          This graph/chart is linked to Excel, and changes automatically based on data. Just left click on it and select "Edit Data".
        </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
