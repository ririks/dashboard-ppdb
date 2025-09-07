import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Kuota() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ id: null, jenjang_kode: "", jumlah: "", tahun_ajaran: "" });

  // Load data
  async function loadKuota() {
    const { data, error } = await supabase.from("kuota_ppdb").select("*").order("id", { ascending: true });
    if (!error) setData(data);
  }

  // Simpan atau update
  async function saveKuota() {
    if (!form.jenjang_kode || !form.tahun_ajaran) return;

    if (form.id) {
      // UPDATE
      await supabase.from("kuota_ppdb").update({
        jenjang_kode: form.jenjang_kode,
        jumlah: form.jumlah,
        tahun_ajaran: form.tahun_ajaran,
      }).eq("id", form.id);
    } else {
      // CREATE
      await supabase.from("kuota_ppdb").insert([{
        jenjang_kode: form.jenjang_kode,
        jumlah: form.jumlah,
        tahun_ajaran: form.tahun_ajaran,
      }]);
    }

    setForm({ id: null, jenjang_kode: "", jumlah: 0, tahun_ajaran: "" });
    loadKuota();
  }

  // Hapus
  async function deleteKuota(id) {
    await supabase.from("kuota_ppdb").delete().eq("id", id);
    loadKuota();
  }

  // Edit (isi form)
  function editKuota(row) {
    setForm({
      id: row.id,
      jenjang_kode: row.jenjang_kode,
      jumlah: row.jumlah,
      tahun_ajaran: row.tahun_ajaran,
    });
  }

  useEffect(() => { loadKuota(); }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📊 Kuota PPDB</h2>

      {/* Form Input */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Jenjang"
          value={form.jenjang_kode}
          onChange={e => setForm({ ...form, jenjang_kode: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Jumlah"
          type="number"
          value={form.jumlah}
          onChange={e => setForm({ ...form, jumlah: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Tahun Ajaran"
          value={form.tahun_ajaran}
          onChange={e => setForm({ ...form, tahun_ajaran: e.target.value })}
        />

        <button
          onClick={saveKuota}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {form.id ? "Update" : "Simpan"}
        </button>

        {form.id && (
          <button
            onClick={() => setForm({ id: null, jenjang_kode: "", jumlah: 0, tahun_ajaran: "" })}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        )}
      </div>

      {/* Tabel Data */}
      <table className="w-full border bg-white shadow rounded">
        <thead>
          <tr className="bg-green-100">
            <th className="p-2">Jenjang</th>
            <th className="p-2">Jumlah</th>
            <th className="p-2">Tahun Ajaran</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-2">{row.jenjang_kode}</td>
              <td className="p-2">{row.jumlah}</td>
              <td className="p-2">{row.tahun_ajaran}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => editKuota(row)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteKuota(row.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
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
  );
}
