import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Kuota() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ id: null, jenjang_kode: "", jumlah: "", tahun_ajaran: "" });

  // Load data
  async function loadKuota() {
    const { data, error } = await supabase
      .from("kuota_ppdb")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setData(data);
  }

  // Simpan atau update
  async function saveKuota() {
    if (!form.jenjang_kode || !form.tahun_ajaran) return;

    if (form.id) {
      await supabase
        .from("kuota_ppdb")
        .update({
          jenjang_kode: form.jenjang_kode,
          jumlah: form.jumlah,
          tahun_ajaran: form.tahun_ajaran,
        })
        .eq("id", form.id);
    } else {
      await supabase.from("kuota_ppdb").insert([
        {
          jenjang_kode: form.jenjang_kode,
          jumlah: form.jumlah,
          tahun_ajaran: form.tahun_ajaran,
        },
      ]);
    }

    setForm({ id: null, jenjang_kode: "", jumlah: 0, tahun_ajaran: "" });
    loadKuota();
  }

  // Hapus
  async function deleteKuota(id) {
    await supabase.from("kuota_ppdb").delete().eq("id", id);
    loadKuota();
  }

  // Edit
  function editKuota(row) {
    setForm({
      id: row.id,
      jenjang_kode: row.jenjang_kode,
      jumlah: row.jumlah,
      tahun_ajaran: row.tahun_ajaran,
    });
  }

  useEffect(() => {
    loadKuota();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📊 Kuota PPDB</h2>

      {/* Form Input */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 bg-green-50 p-4 rounded-2xl shadow">
        <input
          className="border p-2 rounded"
          placeholder="Jenjang"
          value={form.jenjang_kode}
          onChange={(e) => setForm({ ...form, jenjang_kode: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Jumlah"
          type="number"
          value={form.jumlah}
          onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Tahun Ajaran"
          value={form.tahun_ajaran}
          onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })}
        />

        <div className="flex gap-2 col-span-1 md:col-span-4">
          <button
            onClick={saveKuota}
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            {form.id ? "Update" : "Simpan"}
          </button>
          {form.id && (
            <button
              onClick={() => setForm({ id: null, jenjang_kode: "", jumlah: 0, tahun_ajaran: "" })}
              className="bg-gray-500 hover:bg-gray-600 transition text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg shadow overflow-hidden">
          <thead>
            <tr className="bg-green-100 text-black">
              <th className="p-2 text-left">Jenjang</th>
              <th className="p-2 text-left">Jumlah</th>
              <th className="p-2 text-left">Tahun Ajaran</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-green-50">
                <td className="p-2">{row.jenjang_kode}</td>
                <td className="p-2">{row.jumlah}</td>
                <td className="p-2">{row.tahun_ajaran}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => editKuota(row)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteKuota(row.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-sm"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 p-4">
                  Belum ada data kuota.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
