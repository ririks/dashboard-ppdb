import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function formsteps() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    step: "",
    jenjang_kode: "",
    tipe: "",
    kode: "",
    instruksi: "",
  });

  // load data
  async function loadSteps() {
    const { data, error } = await supabase
      .from("form_steps")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setData(data);
  }

  async function saveStep() {
    if (!form.step || !form.tipe || !form.instruksi) return;

    if (form.id) {
      await supabase
        .from("form_steps")
        .update({
          step: form.step,
          jenjang_kode: form.jenjang_kode || null,
          tipe: form.tipe,
          kode: form.kode,
          instruksi: form.instruksi,
        })
        .eq("id", form.id);
    } else {
      await supabase.from("form_steps").insert([
        {
          step: form.step,
          jenjang_kode: form.jenjang_kode || null,
          tipe: form.tipe,
          kode: form.kode,
          instruksi: form.instruksi,
        },
      ]);
    }

    setForm({
      id: null,
      step: "",
      jenjang_kode: "",
      tipe: "",
      kode: "",
      instruksi: "",
    });
    loadSteps();
  }

  async function deleteStep(id) {
    await supabase.from("form_steps").delete().eq("id", id);
    loadSteps();
  }

  function editStep(row) {
    setForm({
      id: row.id,
      step: row.step,
      jenjang_kode: row.jenjang_kode,
      tipe: row.tipe,
      kode: row.kode,
      instruksi: row.instruksi,
    });
  }

  useEffect(() => {
    loadSteps();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📝 Form Steps</h2>

      {/* form input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 bg-green-50 p-4 rounded-2xl shadow">
        <input
          className="border p-2 rounded text-sm"
          placeholder="Step"
          value={form.step}
          onChange={(e) => setForm({ ...form, step: e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          placeholder="Jenjang (opsional)"
          value={form.jenjang_kode || ""}
          onChange={(e) => setForm({ ...form, jenjang_kode: e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          placeholder="Tipe (misal: text/file)"
          value={form.tipe}
          onChange={(e) => setForm({ ...form, tipe: e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          placeholder="Kode field (misal: nama, kk_url)"
          value={form.kode}
          onChange={(e) => setForm({ ...form, kode: e.target.value })}
        />
        <textarea
          className="border p-2 rounded text-sm col-span-1 md:col-span-3"
          placeholder="Instruksi"
          value={form.instruksi}
          onChange={(e) => setForm({ ...form, instruksi: e.target.value })}
        />

        <div className="flex gap-2 col-span-1 md:col-span-3">
          <button
            onClick={saveStep}
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
          >
            {form.id ? "Update" : "Simpan"}
          </button>

          {form.id && (
            <button
              onClick={() =>
                setForm({
                  id: null,
                  step: "",
                  jenjang_kode: "",
                  tipe: "",
                  kode: "",
                  instruksi: "",
                })
              }
              className="bg-gray-500 hover:bg-gray-600 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* tabel data */}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg shadow overflow-hidden text-sm">
          <thead>
            <tr className="bg-green-100 text-black">
              <th className="p-2 text-left">Step</th>
              <th className="p-2 text-left">Jenjang</th>
              <th className="p-2 text-left">Tipe</th>
              <th className="p-2 text-left">Kode</th>
              <th className="p-2 text-left">Instruksi</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((s) => (
              <tr key={s.id} className="border-t hover:bg-green-50">
                <td className="p-2">{s.step}</td>
                <td className="p-2">{s.jenjang_kode || "-"}</td>
                <td className="p-2">{s.tipe}</td>
                <td className="p-2">{s.kode}</td>
                <td className="p-2">{s.instruksi}</td>
                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editStep(s)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow text-xs"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteStep(s.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-xs"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Belum ada data form step.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
