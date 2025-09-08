// src/pages/daftar.jsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_KEY
);

export default function Daftar() {
  const [pendaftar, setPendaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // 🔍 Search & Filter
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJenjang, setFilterJenjang] = useState("all");

  useEffect(() => {
    fetchPendaftar();
  }, []);

  async function fetchPendaftar() {
    setLoading(true);
    const { data, error } = await supabase
      .from("pendaftaran_ppdb")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPendaftar(data || []);
    else console.error(error);

    setLoading(false);
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("pendaftaran_ppdb")
      .update({ status })
      .eq("id", id);

    if (!error) {
      const updated = pendaftar.find((p) => p.id === id);

      // === Approved message ===
      if (status === "approved" && updated) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/send-message`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nomor: updated.nomor,
                pesan: `Halo ${updated.nama}, selamat! 🎉 Pendaftaran Anda diterima.`,
              }),
            }
          );
          const data = await res.json();
          console.log("Respon bot:", data);
        } catch (err) {
          console.error("Gagal panggil API bot:", err);
        }
      }

      // === Rejected message ===
      if (status === "rejected" && updated) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/send-message`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nomor: updated.nomor,
                pesan: `Halo ${updated.nama}, mohon maaf 🙏. Pendaftaran Anda *ditolak*.\nSilakan hubungi admin di nomor 📞 0812-3456-7890 atau email ✉️ ppdb@axxxx.sch.id untuk informasi lebih lanjut.`,
              }),
            }
          );
          const data = await res.json();
          console.log("Respon bot:", data);
        } catch (err) {
          console.error("Gagal panggil API bot:", err);
        }
      }

      // Update state UI
      setPendaftar((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      if (selected?.id === id) setSelected({ ...selected, status });
    } else {
      console.error("Gagal update status:", error.message);
    }
  }

  function statusColor(status) {
    switch (status) {
      case "approved":
        return "bg-green-600";
      case "rejected":
        return "bg-red-600";
      default:
        return "bg-yellow-600";
    }
  }

  // 🔍 Filtered data
  const filteredPendaftar = pendaftar.filter((p) => {
    const matchName = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchJenjang =
      filterJenjang === "all" || p.jenjang_kode === filterJenjang;
    return matchName && matchStatus && matchJenjang;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Daftar Pendaftar PPDB</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Cari nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filterJenjang}
          onChange={(e) => setFilterJenjang(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">Semua Jenjang</option>
          <option value="TK">TK</option>
          <option value="SD">SD</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
        </select>
      </div>

      {/* Daftar */}
      {loading ? (
        <p>Sedang memuat...</p>
      ) : filteredPendaftar.length === 0 ? (
        <p>Tidak ada pendaftar sesuai pencarian/filter.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPendaftar.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-white shadow-lg rounded-2xl p-4 border cursor-pointer hover:shadow-xl transition"
            >
              <h2 className="font-semibold text-lg">{p.nama}</h2>
              <a
  href={`https://wa.me/${p.nomor}`}
  target="_blank"
  rel="noreferrer"
  className="text-sm text-green-600 hover:text-green-800"
>
  📞 {p.nomor}
</a>
              
              <p className="text-sm text-gray-600">🗓️ {p.tgl_lahir}</p>
              <p className="text-sm text-gray-600">🧾 {p.nomor_kk}</p>
              <p className="text-sm text-gray-600">🎓 {p.jenjang_kode}</p>
              <span
                className={`inline-block text-white text-xs px-3 py-1 rounded mt-2 ${statusColor(
                  p.status
                )}`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">{selected.nama}</h2>
            <a
  href={`https://wa.me/${selected.nomor}`}
  target="_blank"
  rel="noreferrer"
  className="text-green-600 hover:text-green-800"
>
  📞 {selected.nomor}
</a>
            
            <p className="text-gray-700">🗓️ {selected.tgl_lahir}</p>
              <p className="text-gray-700">🧾 {selected.nomor_kk}</p>
            <p className="text-gray-700">🎓 {selected.jenjang_kode}</p>
            <span
              className={`inline-block text-white text-xs px-3 py-1 rounded mt-2 ${statusColor(
                selected.status
              )}`}
            >
              {selected.status}
            </span>

            {/* Preview file */}
           {/* Preview file */}
<div className="mt-4 space-y-3">
  {(() => {
    // Tentukan dokumen wajib sesuai jenjang
    let fields = [
      { key: "foto_url", label: "📷 Foto Peserta" },
      { key: "kk_url", label: "📄 Kartu Keluarga" },
      { key: "akta_lahir_url", label: "🍼 Akta Lahir" },
    ];

    if (selected.jenjang_kode === "SMP") {
      fields.push(
        { key: "rapor_url", label: "📘 Rapor SD" },
        { key: "ijazah_url", label: "🎓 Ijazah SD" }
      );
    } else if (selected.jenjang_kode === "SMA") {
      fields.push(
        { key: "rapor_url", label: "📘 Rapor SMP" },
        { key: "ijazah_url", label: "🎓 Ijazah SMP" }
      );
    }
    // TK & SD hanya foto + KK + akta

    return fields.map(({ key, label }) => {
      const val = selected[key];
      if (!val || val === "BELUM ADA") {
        return (
          <p key={key} className="text-gray-500 text-sm">
            {label} belum tersedia
          </p>
        );
      }
      if (key === "foto_url") {
        return (
          <img
            key={key}
            src={val}
            alt="Foto Pendaftar"
            className="rounded-lg w-full max-h-64 object-cover"
          />
        );
      }
      return (
        <a
          key={key}
          href={val}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 text-sm underline block"
        >
          {label}
        </a>
      );
    });
  })()}
</div>


            {/* Tombol aksi */}
            <div className="mt-6 flex gap-2 flex-wrap">
              {selected.status !== "approved" && (
                <button
                  onClick={() => updateStatus(selected.id, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Setuju
                </button>
              )}
              {selected.status !== "rejected" && (
                <button
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Tolak
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
