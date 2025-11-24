import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';

const API_BASE = 'http://localhost:5000/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: 'Pravara Health Clinic',
    currency: 'INR',
    fiscalYearStart: 1,
    defaultDepartment: 'Other',
    emailNotifications: true,
    autoProcessPayroll: false,
    payrollDay: 25
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl grow flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">System Settings</h1>
          <p className="mt-2 text-sm text-gray-600">Configure system preferences and defaults</p>
        </div>

        {/* General Settings */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year Start Month</label>
              <select
                value={settings.fiscalYearStart}
                onChange={(e) => setSettings({ ...settings, fiscalYearStart: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Department</label>
              <select
                value={settings.defaultDepartment}
                onChange={(e) => setSettings({ ...settings, defaultDepartment: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="Clinical">Clinical</option>
                <option value="Administrative">Administrative</option>
                <option value="Support Services">Support Services</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Payroll Settings */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Payroll Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">Auto Process Payroll</label>
                <p className="text-xs text-gray-500">Automatically process payroll on specified day</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoProcessPayroll}
                onChange={(e) => setSettings({ ...settings, autoProcessPayroll: e.target.checked })}
                className="rounded border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payroll Processing Day</label>
              <input
                type="number"
                min="1"
                max="31"
                value={settings.payrollDay}
                onChange={(e) => setSettings({ ...settings, payrollDay: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Day of month to process payroll (1-31)</p>
            </div>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-xs text-gray-500">Receive email notifications for important events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="rounded border-gray-300"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>

        {/* Data Management */}
        <section className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold mb-4 text-red-900">Data Management</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-red-800 mb-2">Danger Zone: These actions cannot be undone</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to export all data? This will download a backup file.')) {
                      // Export functionality
                      alert('Export feature coming soon');
                    }
                  }}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Export All Data
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you absolutely sure? This will delete ALL data and cannot be undone!')) {
                      alert('This feature is disabled for safety');
                    }
                  }}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

