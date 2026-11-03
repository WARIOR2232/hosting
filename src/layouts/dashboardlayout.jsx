import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { Menu } from 'lucide-react';

/** Layout global: Sidebar (drawer di mobile) + konten */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Sidebar (drawer on mobile, statis di lg ke atas) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay drawer mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Area konten */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header untuk mobile */}
        <header className="lg:hidden flex items-center px-4 h-16 shadow bg-white sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
            className="p-2 -ml-2 rounded hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="ml-4 font-semibold">Dashboard</h1>
        </header>

        <main className="flex-1 w-full min-w-0 p-4 sm:p-6 overflow-y-auto bg-gray-50">
          {/* Semua halaman (Outlet) akan dirender di sini */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
