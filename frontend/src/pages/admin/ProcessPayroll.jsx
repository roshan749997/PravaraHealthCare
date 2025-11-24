import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

const API_BASE = 'http://localhost:5000/api';

export default function ProcessPayroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processForm, setProcessForm] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await fetch(`${API_BASE}/payroll`);
      const data = await response.json();
      if (data.success) {
        setPayrolls(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async (e) => {
    e.preventDefault();
    if (!confirm(`Process payroll for ${processForm.month}/${processForm.year}?`)) return;
    
    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE}/payroll/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processForm)
      });

      const data = await response.json();
      if (data.success) {
        await fetchPayrolls();
        alert(`Payroll processed successfully for ${data.data.length} employees!`);
      } else {
        alert('Error processing payroll');
      }
    } catch (error) {
      alert('Error processing payroll');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Process Payroll</h1>
          <p className="mt-2 text-sm text-gray-600">Generate and manage monthly payroll</p>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Process New Payroll</h2>
          <form onSubmit={handleProcessPayroll} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
              <select
                required
                value={processForm.month}
                onChange={(e) => setProcessForm({ ...processForm, month: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                required
                value={processForm.year}
                onChange={(e) => setProcessForm({ ...processForm, year: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={processing}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Process Payroll'}
            </button>
          </form>
        </section>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Month/Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Allowances</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
                ) : payrolls.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-4 text-center">No payroll records found</td></tr>
                ) : (
                  payrolls.map((payroll) => {
                    const emp = payroll.employeeId;
                    const totalAllowances = (payroll.allowances.mobileRecharge || 0) + 
                      (payroll.allowances.petrolDiesel || 0) + 
                      (payroll.allowances.incentive || 0) + 
                      (payroll.allowances.gifts || 0);
                    return (
                      <tr key={payroll._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{emp?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{emp?.employeeId || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {monthNames[payroll.month - 1]} {payroll.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payroll.salary)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(totalAllowances)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(payroll.totalCompensation)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            payroll.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            payroll.status === 'Processed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payroll.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}



