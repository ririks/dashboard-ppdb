import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Pesan() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    kode: "",
    isi: "",
    kategori: "",
  });

  // load data
  async function loadPesan() {
    const { data, error } = await supabase
      .from("pesan_log")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setData(data);
  }

  async function savePesan() {
    if (!form.kode || !form.isi) return;

    if (form.id) {
      await supabase
        .from("pesan_log")
        .update({
          kode: form.kode,
          isi: form.isi,
          kategori: form.kategori,
        })
        .eq("id", form.id);
    } else {
      await supabase.from("pesan_log").insert([
        {
          kode: form.kode,
          isi: form.isi,
          kategori: form.kategori,
        },
      ]);
    }

    setForm({ id: null, kode: "", isi: "", kategori: "" });
    loadPesan();
  }

  async function deletePesan(id) {
    await supabase.from("pesan_log").delete().eq("id", id);
    loadPesan();
  }

  function editPesan(row) {
    setForm({
      id: row.id,
      kode: row.kode,
      isi: row.isi,
      kategori: row.kategori,
    });
  }

  useEffect(() => {
    loadPesan();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📜 Pesan Log</h2>

      {/* form input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 bg-blue-50 p-4 rounded-2xl shadow">
        <input
          className="border p-2 rounded text-sm"
          placeholder="Kode pesan"
          value={form.kode}
          onChange={(e) => setForm({ ...form, kode: e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          placeholder="Kategori (sukses/error/info)"
          value={form.kategori}
          onChange={(e) => setForm({ ...form, kategori: e.target.value })}
        />
        <textarea
          className="border p-2 rounded text-sm col-span-1 md:col-span-3"
          placeholder="Isi pesan"
          value={form.isi}
          onChange={(e) => setForm({ ...form, isi: e.target.value })}
        />

        <div className="flex gap-2 col-span-1 md:col-span-3">
          <button
            onClick={savePesan}
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
          >
            {form.id ? "Update" : "Simpan"}
          </button>

          {form.id && (
            <button
              onClick={() => setForm({ id: null, kode: "", isi: "", kategori: "" })}
              className="bg-gray-500 hover:bg-gray-600 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* tabel data */}
      <div className="overflow-x-auto">
        <table className="w-full border border-blue-200 rounded-lg shadow overflow-hidden text-sm">
          <thead>
            <tr className="bg-blue-100 text-black">
              <th className="p-2 text-left">Kode</th>
              <th className="p-2 text-left">Kategori</th>
              <th className="p-2 text-left">Isi Pesan</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((p) => (
              <tr key={p.id} className="border-t hover:bg-blue-50">
                <td className="p-2">{p.kode}</td>
                <td className="p-2">{p.kategori}</td>
                <td className="p-2">{p.isi}</td>
                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editPesan(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-xs"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deletePesan(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-xs"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Belum ada data pesan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
