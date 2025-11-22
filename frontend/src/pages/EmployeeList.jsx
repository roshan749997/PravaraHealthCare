import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { Cell, Funnel, FunnelChart, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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

const funnelColors = ["#6366F1", "#60A5FA", "#10B981", "#6366F1", "#60A5FA", "#10B981"];

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

const pipelineColors = ["#6366F1", "#60A5FA", "#10B981", "#6366F1", "#60A5FA", "#10B981"];

const highlightCards = [
  {
    title: "Top Sourcing Channel",
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
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl grow px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex flex-col gap-8 rounded-lg border border-gray-200 bg-white sm:p-8 xl:p-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Overview
            </p>
            <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">
              Monthly Hiring Dashboard with Recruitment Funnel
            </h1>
          </div>
          <p className="self-start rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            August 2021
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overviewStats.map((stat) => (
            <article
              key={stat.label}
              className={`group flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 transition sm:p-6`}
            >
              <header className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">{stat.label}</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[0.65rem] font-medium text-gray-700 transition">
                  {stat.change}
                </span>
              </header>
              <div className="mt-4">
                <p className="text-3xl font-semibold sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-500">{stat.subtitle}</p>
              </div>
              <div className="mt-5">
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${stat.progress}%` }} />
                </div>
                <p className={`mt-2 text-xs font-semibold text-emerald-600`}>{stat.progressLabel}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Monthly Metrics</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3 text-center">Hired</th>
                    <th className="px-4 py-3 text-center">Days to Hire</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyMetrics.map((row, index) => (
                    <tr
                      key={row.month}
                      className="bg-white"
                    >
                      <td className="px-4 py-3 font-medium">{row.month}</td>
                      <td
                        className={`px-4 py-3 text-center text-base font-semibold ${
                          row.hired === "1" ? "text-indigo-600" : "text-gray-900"
                        }`}
                      >
                        {row.hired}
                      </td>
                      <td
                        className={`px-4 py-3 text-center text-base font-semibold ${
                          row.daysToHire === "6" ? "text-indigo-600" : "text-gray-900"
                        }`}
                      >
                        {row.daysToHire}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gray-700">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Recruitment Funnel</h2>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: "12px", color: "#111827" }} />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive={false}
                    fill="#6366F1"
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
                    />
                    <LabelList
                      position="inside"
                      fill="#111827"
                      stroke="none"
                      dataKey="value"
                      formatter={(value) => (value !== undefined ? `${value}%` : "")}
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 space-y-3">
              {funnelInsights.map((item) => (
                <li key={item.stage} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{item.stage}</p>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-indigo-600">{item.drop}</span>
                    <span>{item.note}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Pipeline Efficiency of Hiring</h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
              Days taken for each stage in recruitment process
            </p>
            <div className="mt-2 h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Tooltip formatter={(value) => `${value}%`} contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", borderRadius: "12px", color: "#111827" }} />
                  <Pie
                    data={pipelineData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="90%"
                    stroke="none"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={entry.name} fill={pipelineColors[index]} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-900 text-2xl font-semibold"
                  >
                    100%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {pipelineData.map((stage, index) => (
                <li
                  key={stage.name}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-3"
                >
                  <span
                    className="mt-1 h-3 w-3 rounded-full"
                    style={{ backgroundColor: pipelineColors[index] }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold">{stage.name}</p>
                    <p className="text-xs text-gray-500">{stage.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlightCards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-6"
            >
              <span className={`inline-flex w-max items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-700`}>
                {card.title}
              </span>
              <p className="text-lg font-semibold">{card.value}</p>
              <p className="text-sm text-gray-600">{card.description}</p>
            </article>
          ))}
        </section>

        <p className="text-center text-xs text-gray-500">
          This graph/chart is linked to Excel, and changes automatically based on data. Just left click on it and select "Edit Data".
        </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
