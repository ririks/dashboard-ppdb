import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";
import { Users, CreditCard, ClipboardList, BookOpen } from "lucide-react";

export default function Beranda() {
  const [stats, setStats] = useState({
    kuota: 0,
    biaya: 0,
    faq: 0,
    users: 0,
  });

  async function loadStats() {
    const { count: kuota } = await supabase
      .from("kuota_ppdb")
      .select("*", { count: "exact", head: true });
    const { count: biaya } = await supabase
      .from("biaya_ppdb")
      .select("*", { count: "exact", head: true });
    const { count: faq } = await supabase
      .from("faq")
      .select("*", { count: "exact", head: true });
    const { count: users } = await supabase
      .from("users_wa")
      .select("*", { count: "exact", head: true });

    setStats({
      kuota: kuota || 0,
      biaya: biaya || 0,
      faq: faq || 0,
      users: users || 0,
    });
  }

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = [
    { label: "Kuota", value: stats.kuota, icon: <ClipboardList size={28} className="text-green-500" />, color: "bg-green-50" },
    { label: "Biaya", value: stats.biaya, icon: <CreditCard size={28} className="text-blue-500" />, color: "bg-blue-50" },
    { label: "FAQ", value: stats.faq, icon: <BookOpen size={28} className="text-yellow-500" />, color: "bg-yellow-50" },
    { label: "Users WA", value: stats.users, icon: <Users size={28} className="text-purple-500" />, color: "bg-purple-50" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        📊 Statistik PPDB
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl shadow hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${card.color} flex flex-col items-center justify-center`}
          >
            {card.icon}
            <p className="mt-2 text-gray-600 font-medium">{card.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
