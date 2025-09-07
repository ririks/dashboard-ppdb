import { useState } from "react";
import { Sidebar } from "../components/sidebar";
import Beranda from "./beranda";
import Daftar from "./daftar";
import Kuota from "./kuota";
import Biaya from "./biaya";
import Faq from "./faq";
import Users from "./user";

export default function Dashboard() {
  const [active, setActive] = useState("beranda");

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 p-6 overflow-y-auto">
        {active === "beranda" && <Beranda />}
        {active === "daftar" && <Daftar />}
        {active === "kuota" && <Kuota />}
        {active === "biaya" && <Biaya />}
        {active === "faq" && <Faq />}
        {active === "users" && <Users />}
      </div>
    </div>
  );
}
