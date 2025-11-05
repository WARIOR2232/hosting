import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { Home, Users, Bell, Settings, LogOut } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // 🔒 Pastikan ambil data user dengan aman
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "Users", currentUser.uid)); // ✅ Pastikan "Users" sesuai koleksi Firestore kamu
          setRole(snap.exists() ? snap.data().role : "user");
        } catch (error) {
          console.error("Gagal mengambil role:", error);
          setRole("user");
        }
      } else {
        setRole("user");
      }
    });

    return () => unsubscribe();
  }, []);

  // ⏳ Jika role belum diambil, tampilkan loading singkat
  if (role === null) {
    return (
      <aside className="w-64 bg-[#27793c] text-white flex items-center justify-center">
        <span>Loading menu...</span>
      </aside>
    );
  }

  // 📋 Menu dasar
  const baseMenu = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/tenants", label: "SIP", icon: Users },
  ];

  // 🛠️ Menu admin tambahan
  const adminMenu = [
    { to: "/NotificationPage", label: "Notifikasi", icon: Bell },
    { to: "/TambahData", label: "Tambah Data", icon: Settings },
  ];

  // 🧩 Gabung menu tergantung role
  const menu = role === "admin" ? [...baseMenu, ...adminMenu] : baseMenu;

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-20 w-64 flex flex-col
        bg-[#27793c] text-white
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-200`}
    >
      <div className="flex items-center justify-between px-6 h-16">
        <span className="text-xl font-bold">DashKEK</span>
        <button className="md:hidden" onClick={onClose}>
          ✕
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menu.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition
               ${
                 isActive
                   ? "bg-[#35964f] text-white"
                   : "text-white/80 hover:bg-[#35964f]/80 hover:text-white"
               }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => signOut(auth)}
        className="flex items-center gap-3 px-6 py-3 hover:bg-[#35964f]/80 transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
