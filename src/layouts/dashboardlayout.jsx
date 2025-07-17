import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

/** Layout global: Sidebar + konten */
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (drawer on mobile) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Area konten */}
      <div className="flex-1 flex flex-col">
        {/* Header untuk mobile */}
        <header className="md:hidden flex items-center px-4 h-16 shadow bg-white">
          <button onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="ml-4 font-semibold">Dashboard</h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {/* Semua halaman (Outlet) akan dirender di sini */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
