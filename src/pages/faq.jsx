import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Faq() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    keyword: "",
    subkey: "",
    konten: "",
  });

  // Ambil data dari tabel faq
  async function loadFaq() {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("keyword", { ascending: true });

    if (!error) setData(data);
  }

  // Simpan / update FAQ
  async function saveFaq() {
    if (!form.keyword || !form.konten) {
      return alert("Keyword & Konten wajib diisi!");
    }

    if (form.id) {
      await supabase
        .from("faq")
        .update({
          keyword: form.keyword,
          subkey: form.subkey || null,
          konten: form.konten,
        })
        .eq("id", form.id);
    } else {
      await supabase.from("faq").insert([
        {
          keyword: form.keyword,
          subkey: form.subkey || null,
          konten: form.konten,
        },
      ]);
    }

    setForm({ id: null, keyword: "", subkey: "", konten: "" });
    loadFaq();
  }

  function editFaq(f) {
    setForm({
      id: f.id,
      keyword: f.keyword,
      subkey: f.subkey || "",
      konten: f.konten,
    });
  }

  async function deleteFaq(id) {
    await supabase.from("faq").delete().eq("id", id);
    loadFaq();
  }

  useEffect(() => {
    loadFaq();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">❓ FAQ PPDB</h2>

      {/* Form input FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 bg-green-50 p-4 rounded-2xl shadow">
        <input
          className="border border-green-300 p-2 rounded text-sm"
          placeholder="Keyword (contoh: syarat, jadwal, beasiswa)"
          value={form.keyword}
          onChange={(e) => setForm({ ...form, keyword: e.target.value })}
        />
        <input
          className="border border-green-300 p-2 rounded text-sm"
          placeholder="Subkey (opsional, misal: SD, SMP)"
          value={form.subkey}
          onChange={(e) => setForm({ ...form, subkey: e.target.value })}
        />
        <textarea
          className="border border-green-300 p-2 rounded col-span-1 md:col-span-3 text-sm"
          rows={3}
          placeholder="Isi konten FAQ"
          value={form.konten}
          onChange={(e) => setForm({ ...form, konten: e.target.value })}
        />
        <div className="col-span-1 md:col-span-3 flex gap-2">
          <button
            onClick={saveFaq}
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
          >
            {form.id ? "Update" : "Simpan"}
          </button>
          {form.id && (
            <button
              onClick={() =>
                setForm({ id: null, keyword: "", subkey: "", konten: "" })
              }
              className="bg-gray-500 hover:bg-gray-600 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Tabel Data (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg shadow overflow-hidden text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-2 text-left">Keyword</th>
              <th className="p-2 text-left">Subkey</th>
              <th className="p-2 text-left">Konten</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((f) => (
              <tr key={f.id} className="border-t hover:bg-green-50">
                <td className="p-2 font-medium">{f.keyword}</td>
                <td className="p-2">{f.subkey || "-"}</td>
                <td className="p-2 whitespace-pre-line">{f.konten}</td>
                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editFaq(f)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-xs"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteFaq(f.id)}
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
                  Belum ada data FAQ.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {data.map((f) => (
          <div key={f.id} className="bg-white shadow rounded-lg p-4">
            <p>
              <span className="font-semibold">Keyword:</span> {f.keyword}
            </p>
            <p>
              <span className="font-semibold">Subkey:</span> {f.subkey || "-"}
            </p>
            <p className="whitespace-pre-line">
              <span className="font-semibold">Konten:</span> {f.konten}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => editFaq(f)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-xs"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteFaq(f.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-xs"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center text-gray-500">Belum ada data FAQ.</p>
        )}
      </div>
    </div>
  );
}
