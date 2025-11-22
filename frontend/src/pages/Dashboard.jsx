import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
    title: "Conversion Rate",
    value: "3.8%",
    helper: "+0.6pp vs last month",
    gradient: "from-[#A020F0] via-[#D400FF] to-[#FF00CC]",
    badge: "Healthy",
    badgeTone: "bg-white/20 text-white",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex grow">
        <div className="flex w-full flex-col gap-8 px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
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
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {kpiCards.map((card) => (
              <article
                key={card.title}
                className={`rounded-lg border border-gray-200 bg-white p-5`}
              >
                <div className="relative flex items-start justify-between">
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600">
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
            ))}
          </section>

          {/* TOTAL SALES + SUMMARY */}
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Total Sales</p>
                  <h2 className="mt-2 text-3xl font-semibold">₹895.39K</h2>
                  <p className="text-xs text-gray-500">last 30 days · +12.5% vs previous period</p>
                </div>
                <div className="mt-3 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Jan 1, 2023 – Jun 30, 2023
                </div>
              </div>

              {/* 🔥🔥 BAR GRAPH (updated) */}
              <div className="mt-6 h-48">
                <ResponsiveContainer>
                  <BarChart data={topLineData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: "#6B7280" }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: "#6B7280" }} tickFormatter={(value) => `₹${value}K`} />
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

            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Summary</p>
              <p className="mt-2 text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {summaryStats.map((stat) => (
                  <article key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
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
          <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            
            {/* SALES FUNNEL */}
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
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

              <div className="mt-6 h-40">
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

              <div className="mt-6 grid gap-4 sm:grid-cols-5">
                {funnelStages.map((stage) => (
                  <div key={stage.step} className="flex flex-col gap-1 rounded-md border border-gray-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">{stage.step}</p>
                    <p className="text-lg font-semibold">{stage.value}</p>
                    <p className="text-[0.65rem] text-gray-500">{stage.conversion}</p>
                    <div className="mt-auto h-2 rounded-full bg-indigo-500" />
                  </div>
                ))}
              </div>
            </article>

            {/* LIFETIME VALUE */}
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Average Lifetime Revenue</p>
                  <p className="text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <span className="mt-3 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  +₹56K YoY
                </span>
              </div>

              <div className="mt-6 h-48">
                <ResponsiveContainer>
                  <LineChart data={lifetimeRevenueData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(99, 102, 241, 0.2)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: "#6B7280" }} />
                    <YAxis stroke="#9CA3AF" tick={{ fill: "#6B7280" }} tickFormatter={(value) => `₹${value}K`} />
                    <Tooltip
                      labelFormatter={(label) => `Month: ${label}`}
                      formatter={(value, name) => [`₹${value}K`, name]}
                      contentStyle={{
                        borderRadius: "1rem",
                        borderColor: "#E5E7EB",
                        backgroundColor: "#FFFFFF",
                        color: "#111827"
                      }}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 8, color: "#111827" }} />

                    <Line
                      type="monotone"
                      dataKey="newCustomers"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#10B981" }}
                      name="New customers"
                    />
                    <Line
                      type="monotone"
                      dataKey="returningCustomers"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#6366F1" }}
                      name="Returning customers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          {/* RETENTION + ACTION CENTER */}
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <article className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Customer Retention</p>
                  <p className="text-xs text-gray-500">Jan 1, 2023 – Jun 30, 2023</p>
                </div>
                <span className="mt-3 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  87% avg retention
                </span>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-500">Month</th>
                      {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"].map((label) => (
                        <th key={label} className="px-3 py-2 text-center text-gray-500">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {retentionMatrix.map((row) => (
                      <tr key={row.month}>
                        <td className="px-3 py-2 text-left text-sm font-semibold">{row.month}</td>
                        {row.cohorts.map((value, idx) => (
                          <td key={`${row.month}-${idx}`} className="px-1 py-1 text-center">
                            <div className={`rounded-lg border border-indigo-100 bg-indigo-50 px-2 py-3 text-xs font-semibold text-indigo-700`}>
                              {value}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#A0A0A0]">
                {retentionLegend.map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1">
                    <span className="h-2 w-6 rounded-full bg-indigo-500" />
                    {item.label}
                  </span>
                ))}
              </div>
            </article>

            <article className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Action Center</p>
                  <p className="text-xs text-gray-500">Keep momentum high with these next steps</p>
                </div>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">3 open</span>
              </div>

              <ul className="space-y-3">
                {actionItems.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium"
                  >
                    <p>{item.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      <span>{item.owner}</span>
                      <span>{item.due}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <button className="mt-auto rounded-md border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
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
