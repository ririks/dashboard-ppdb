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

      // Kalau status = approved → kirim pesan WA via API bot di Railway
      if (status === "approved" && updated) {
        try {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/send-message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nomor: updated.nomor,
      pesan: `Halo ${updated.nama}, selamat! 🎉 Pendaftaran Anda diterima.`
    }),
  });
  const data = await res.json();
  console.log("Respon bot:", data);
} catch (err) {
  console.error("Gagal panggil API bot:", err);
}
      }

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Daftar Pendaftar PPDB</h1>

      {loading ? (
        <p>Sedang memuat...</p>
      ) : pendaftar.length === 0 ? (
        <p>Belum ada pendaftar.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendaftar.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="bg-white shadow-lg rounded-2xl p-4 border cursor-pointer hover:shadow-xl transition"
            >
              <h2 className="font-semibold text-lg">{p.nama}</h2>
              <p className="text-sm text-gray-600">📞 {p.nomor}</p>
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
            <p className="text-gray-700">📞 {selected.nomor}</p>
            <p className="text-gray-700">🎓 {selected.jenjang_kode}</p>
            <span
              className={`inline-block text-white text-xs px-3 py-1 rounded mt-2 ${statusColor(
                selected.status
              )}`}
            >
              {selected.status}
            </span>

            {/* Preview file */}
            <div className="mt-4 space-y-3">
              {[
                { key: "foto_url", label: "📷 Foto Peserta" },
                { key: "kk_url", label: "📄 Kartu Keluarga" },
                { key: "rapor_url", label: "📘 Rapor" },
                { key: "ijazah_url", label: "🎓 Ijazah" },
                { key: "akta_lahir_url", label: "🍼 Akta Lahir" },
              ].map(({ key, label }) => {
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
              })}
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
