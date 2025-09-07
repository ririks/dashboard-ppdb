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

  // simpan atau update
  async function saveBiaya() {
    if (!form.jenjang_kode || !form.tahun_ajaran) return;

    if (form.id) {
      // UPDATE
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
      // CREATE
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

    // reset form
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

  // hapus
  async function deleteBiaya(id) {
    await supabase.from("biaya_ppdb").delete().eq("id", id);
    loadBiaya();
  }

  // edit (isi form dengan data lama)
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <input
          className="border p-2"
          placeholder="Jenjang (SD/SMP/SMA)"
          value={form.jenjang_kode}
          onChange={(e) => setForm({ ...form, jenjang_kode: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Tahun Ajaran"
          value={form.tahun_ajaran}
          onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })}
        />
        <input
          className="border p-2"
          type="number"
          placeholder="Formulir"
          value={form.formulir}
          onChange={(e) => setForm({ ...form, formulir: +e.target.value })}
        />
        <input
          className="border p-2"
          type="number"
          placeholder="SPP"
          value={form.spp}
          onChange={(e) => setForm({ ...form, spp: +e.target.value })}
        />
        <input
          className="border p-2"
          type="number"
          placeholder="Uang Pangkal"
          value={form.uang_pangkal}
          onChange={(e) => setForm({ ...form, uang_pangkal: +e.target.value })}
        />
        <input
          className="border p-2"
          type="number"
          placeholder="Seragam"
          value={form.seragam}
          onChange={(e) => setForm({ ...form, seragam: +e.target.value })}
        />
        <input
          className="border p-2"
          type="number"
          placeholder="Kegiatan"
          value={form.kegiatan}
          onChange={(e) => setForm({ ...form, kegiatan: +e.target.value })}
        />

        <button
          onClick={saveBiaya}
          className="bg-green-600 text-white px-4 py-2 rounded"
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
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        )}
      </div>

      {/* tabel data */}
      <table className="w-full border bg-white shadow rounded">
        <thead>
          <tr className="bg-green-100">
            <th className="p-2">Jenjang</th>
            <th className="p-2">Tahun</th>
            <th className="p-2">Formulir</th>
            <th className="p-2">Uang Pangkal</th>
            <th className="p-2">SPP</th>
            <th className="p-2">Seragam</th>
            <th className="p-2">Kegiatan</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="p-2">{b.jenjang_kode}</td>
              <td className="p-2">{b.tahun_ajaran}</td>
              <td className="p-2">Rp {b.formulir.toLocaleString()}</td>
              <td className="p-2">Rp {b.uang_pangkal.toLocaleString()}</td>
              <td className="p-2">Rp {b.spp.toLocaleString()}</td>
              <td className="p-2">Rp {b.seragam.toLocaleString()}</td>
              <td className="p-2">Rp {b.kegiatan.toLocaleString()}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => editBiaya(b)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBiaya(b.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
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
  );
}
