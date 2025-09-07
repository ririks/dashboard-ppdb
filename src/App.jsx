import { useState } from "react";
import Kuota from "./pages/kuota";
import Biaya from "./pages/biaya";
import Faq from "./pages/faq";
import Users from "./pages/user";
import Beranda from "./pages/beranda";
import Daftar from "./pages/daftar";

function Sidebar({ active, setActive }) {
  const menus = [
    { key: "beranda", label: "Home" },
    { key: "daftar", label: "Daftar" },
    { key: "kuota", label: "Kuota" },
    { key: "biaya", label: "Biaya" },
    { key: "faq", label: "FAQ" },
    { key: "users", label: "Users WA" },
  ];

  return (
    <div className="w-56 bg-gray-800 text-white flex flex-col">
      <div className="p-4 font-bold text-lg border-b border-gray-700">
        Dashboard PPDB
      </div>
      <nav className="flex-1">
        {menus.map((m) => (
          <button
            key={m.key}
            onClick={() => setActive(m.key)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
              active === m.key ? "bg-gray-700 font-semibold" : ""
            }`}
          >
            {m.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Navbar() {
  return (
    <div className="h-14 bg-white shadow flex items-center px-4">
      <h1 className="text-lg font-bold">PPDB Admin Dashboard</h1>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("beranda");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {active === "beranda" && <Beranda />}
          {active === "daftar" && <Daftar />}
          {active === "kuota" && <Kuota />}
          {active === "biaya" && <Biaya />}
          {active === "faq" && <Faq />}
          {active === "users" && <Users />}
        </div>
      </div>
    </div>
  );
}
