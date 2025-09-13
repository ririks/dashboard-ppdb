import { useState } from "react";
import { Sidebar } from "../components/sidebar";
import Beranda from "./beranda";
import Daftar from "./daftar";
import Kuota from "./kuota";
import Biaya from "./biaya";
import Faq from "./faq";
import Users from "./user";
import Pesan from "./pesan_log";
import formsteps from "./form_steps";
import { Menu } from "lucide-react";

export default function Dashboard() {
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
        {/* Navbar */}
        <div className="h-14 bg-white shadow flex items-center px-4">
          <button
            className="md:hidden mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold">PPDB Admin Dashboard</h1>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === "beranda" && <Beranda />}
          {active === "daftar" && <Daftar />}
          {active === "kuota" && <Kuota />}
          {active === "biaya" && <Biaya />}
          {active === "faq" && <Faq />}
          {active === "users" && <Users />}
          {active === "pesan_log" && <Pesan />}
          {active === "form_steps" && <form />}
        </div>
      </div>
    </div>
  );
}
