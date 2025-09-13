import { useState } from "react";
import Kuota from "./pages/kuota";
import Biaya from "./pages/biaya";
import Faq from "./pages/faq";
import Users from "./pages/user";
import Beranda from "./pages/beranda";
import Daftar from "./pages/daftar";
import Pesan from "./pages/pesan_log";
import Formsteps from "./pages/form_steps";

import { Menu, X } from "lucide-react";

function Sidebar({ active, setActive, isOpen, onClose }) {
  const menus = [
    { key: "beranda", label: "Home" },
    { key: "daftar", label: "Daftar" },
    { key: "kuota", label: "Kuota" },
    { key: "biaya", label: "Biaya" },
    { key: "faq", label: "FAQ" },
    { key: "users", label: "Users WA" },
  { key: "pesan_log", label: "Pesan Log" },
    { key: "form_steps", label: "Form Steps" },
  ];

  return (
    <>
      {/* Overlay di HP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-56 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center">
          Dashboard PPDB
          <button onClick={onClose} className="md:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1">
          {menus.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                setActive(m.key);
                onClose(); // otomatis tutup kalau di HP
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                active === m.key ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

function Navbar({ onMenuClick }) {
  return (
    <div className="h-14 bg-white shadow flex items-center px-4">
      {/* Tombol hamburger di HP */}
      <button
        className="md:hidden mr-3 text-gray-700"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-bold">PPDB Admin Dashboard</h1>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("beranda");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 p-6 overflow-y-auto">
          {active === "beranda" && <Beranda />}
          {active === "daftar" && <Daftar />}
          {active === "kuota" && <Kuota />}
          {active === "biaya" && <Biaya />}
          {active === "faq" && <Faq />}
          {active === "users" && <Users />}
          {active === "pesan_log" && <Pesan Log />}
          {active === "form_steps" && <Form Steps />}
        </div>
      </div>
    </div>
  );
}
