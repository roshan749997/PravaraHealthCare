import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FinancialAnalyticsPanel from "../components/FinancialAnalytics.jsx";

export default function FinancialAnalytics() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
        <FinancialAnalyticsPanel />
      </main>
      <Footer />
    </div>
  );
}

