import { NavLink } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const menu = [
    { to: '/',           label: 'Dashboard',   icon: Home },
    { to: '/tenants',    label: 'SIP',     icon: Users },
    { to: '/NotificationPage',label: 'Notifikasi', icon: Bell },
    //{ to: '/settings',   label: 'Settings',    icon: Settings },
    { to: '/TambahData',   label: 'Tambah data',    icon: Settings },
  ];

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-20 w-64 flex flex-col
                  bg-[#27793c] text-white
                  transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                  md:translate-x-0 transition-transform duration-200`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between px-6 h-16">
        <span className="text-xl font-bold tracking-wide">DashKEK</span>
        <button className="md:hidden" onClick={onClose}>✕</button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menu.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition
               ${isActive
                 ? 'bg-[#35964f] text-white'
                 : 'text-white/80 hover:bg-[#35964f]/80 hover:text-white'}`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={() => signOut(auth)}
        className="flex items-center gap-3 px-6 py-3 text-white -500 hover:bg-[#35964f]/80 hover:text-white transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
