// src/components/sidebar.jsx
import { Home, ClipboardList, Database, DollarSign, HelpCircle, Users, X } from "lucide-react";

export function Sidebar({ active, setActive, isOpen, onClose }) {
  const menus = [
    { key: "beranda", label: "Beranda", icon: Home },
    { key: "daftar", label: "Pendaftaran", icon: ClipboardList },
    { key: "kuota", label: "Kuota", icon: Database },
    { key: "biaya", label: "Biaya", icon: DollarSign },
    { key: "faq", label: "FAQ", icon: HelpCircle },
    { key: "users", label: "Users WA", icon: Users },
  ];

  return (
    <div
      className={`fixed md:static top-0 left-0 h-full w-64 bg-green-700 text-white flex flex-col transform transition-transform duration-300 z-50
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Header Sidebar */}
      <div className="p-4 text-2xl font-bold border-b border-green-600 flex justify-between items-center">
        🎓 PPDB Admin
        <button onClick={onClose} className="md:hidden">
          <X size={24} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2">
        {menus.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => {
                setActive(m.key);
                onClose(); // otomatis tutup kalau di HP
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl mb-2 transition-colors ${
                active === m.key
                  ? "bg-green-900 font-semibold"
                  : "hover:bg-green-800"
              }`}
            >
              <Icon size={20} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
