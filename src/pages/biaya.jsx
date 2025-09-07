import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Biaya() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    id: null,
    jenjang_kode: "",
    tahun_ajaran: "",
    formulir: "",
    spp: "",
    uang_pangkal: "",
    seragam: "",
    kegiatan: "",
  });

  // load data
  async function loadBiaya() {
    const { data, error } = await supabase
      .from("biaya_ppdb")
      .select("*")
      .order("jenjang_kode", { ascending: true });

    if (!error) setData(data);
  }

  async function saveBiaya() {
    if (!form.jenjang_kode || !form.tahun_ajaran) return;

    if (form.id) {
      await supabase
        .from("biaya_ppdb")
        .update({
          jenjang_kode: form.jenjang_kode,
          tahun_ajaran: form.tahun_ajaran,
          formulir: form.formulir,
          spp: form.spp,
          uang_pangkal: form.uang_pangkal,
          seragam: form.seragam,
          kegiatan: form.kegiatan,
        })
        .eq("id", form.id);
    } else {
      await supabase.from("biaya_ppdb").insert([
        {
          jenjang_kode: form.jenjang_kode,
          tahun_ajaran: form.tahun_ajaran,
          formulir: form.formulir,
          spp: form.spp,
          uang_pangkal: form.uang_pangkal,
          seragam: form.seragam,
          kegiatan: form.kegiatan,
        },
      ]);
    }

    setForm({
      id: null,
      jenjang_kode: "",
      tahun_ajaran: "",
      formulir: 0,
      spp: 0,
      uang_pangkal: 0,
      seragam: 0,
      kegiatan: 0,
    });

    loadBiaya();
  }

  async function deleteBiaya(id) {
    await supabase.from("biaya_ppdb").delete().eq("id", id);
    loadBiaya();
  }

  function editBiaya(row) {
    setForm({
      id: row.id,
      jenjang_kode: row.jenjang_kode,
      tahun_ajaran: row.tahun_ajaran,
      formulir: row.formulir,
      spp: row.spp,
      uang_pangkal: row.uang_pangkal,
      seragam: row.seragam,
      kegiatan: row.kegiatan,
    });
  }

  useEffect(() => {
    loadBiaya();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">💰 Biaya PPDB</h2>

      {/* form input */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 bg-green-50 p-4 rounded-2xl shadow">
        <input
          className="border p-2 rounded text-sm"
          placeholder="Jenjang (SD/SMP/SMA)"
          value={form.jenjang_kode}
          onChange={(e) => setForm({ ...form, jenjang_kode: e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          placeholder="Tahun Ajaran"
          value={form.tahun_ajaran}
          onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          type="number"
          placeholder="Formulir"
          value={form.formulir}
          onChange={(e) => setForm({ ...form, formulir: +e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          type="number"
          placeholder="SPP"
          value={form.spp}
          onChange={(e) => setForm({ ...form, spp: +e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          type="number"
          placeholder="Uang Pangkal"
          value={form.uang_pangkal}
          onChange={(e) => setForm({ ...form, uang_pangkal: +e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          type="number"
          placeholder="Seragam"
          value={form.seragam}
          onChange={(e) => setForm({ ...form, seragam: +e.target.value })}
        />
        <input
          className="border p-2 rounded text-sm"
          type="number"
          placeholder="Kegiatan"
          value={form.kegiatan}
          onChange={(e) => setForm({ ...form, kegiatan: +e.target.value })}
        />

        <div className="flex gap-2 col-span-2 md:col-span-4">
          <button
            onClick={saveBiaya}
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
          >
            {form.id ? "Update" : "Simpan"}
          </button>

          {form.id && (
            <button
              onClick={() =>
                setForm({
                  id: null,
                  jenjang_kode: "",
                  tahun_ajaran: "",
                  formulir: 0,
                  spp: 0,
                  uang_pangkal: 0,
                  seragam: 0,
                  kegiatan: 0,
                })
              }
              className="bg-gray-500 hover:bg-gray-600 transition text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* tabel data desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg shadow overflow-hidden text-sm">
          <thead>
            <tr className="bg-green-100 text-black">
              <th className="p-2 text-left">Jenjang</th>
              <th className="p-2 text-left">Tahun</th>
              <th className="p-2 text-left">Formulir</th>
              <th className="p-2 text-left">Uang Pangkal</th>
              <th className="p-2 text-left">SPP</th>
              <th className="p-2 text-left">Seragam</th>
              <th className="p-2 text-left">Kegiatan</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((b) => (
              <tr key={b.id} className="border-t hover:bg-green-50">
                <td className="p-2">{b.jenjang_kode}</td>
                <td className="p-2">{b.tahun_ajaran}</td>
                <td className="p-2">Rp {b.formulir.toLocaleString()}</td>
                <td className="p-2">Rp {b.uang_pangkal.toLocaleString()}</td>
                <td className="p-2">Rp {b.spp.toLocaleString()}</td>
                <td className="p-2">Rp {b.seragam.toLocaleString()}</td>
                <td className="p-2">Rp {b.kegiatan.toLocaleString()}</td>
                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editBiaya(b)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-xs"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteBiaya(b.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-xs"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Belum ada data biaya.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* tampilan mobile pakai card */}
      <div className="md:hidden space-y-3">
        {data.map((b) => (
          <div key={b.id} className="bg-white shadow rounded-lg p-4">
            <p><span className="font-semibold">Jenjang:</span> {b.jenjang_kode}</p>
            <p><span className="font-semibold">Tahun:</span> {b.tahun_ajaran}</p>
            <p><span className="font-semibold">Formulir:</span> Rp {b.formulir.toLocaleString()}</p>
            <p><span className="font-semibold">Uang Pangkal:</span> Rp {b.uang_pangkal.toLocaleString()}</p>
            <p><span className="font-semibold">SPP:</span> Rp {b.spp.toLocaleString()}</p>
            <p><span className="font-semibold">Seragam:</span> Rp {b.seragam.toLocaleString()}</p>
            <p><span className="font-semibold">Kegiatan:</span> Rp {b.kegiatan.toLocaleString()}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => editBiaya(b)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-xs"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => deleteBiaya(b.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-xs"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center text-gray-500">Belum ada data biaya.</p>
        )}
      </div>
    </div>
  );
}
