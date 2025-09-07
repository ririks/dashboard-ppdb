import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nomor: "",
    nama: "",
  });

  // Ambil data dari tabel users_wa
  async function loadUsers() {
    const { data, error } = await supabase
      .from("users_wa")
      .select("id, nomor, nama, created_at")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data);
  }

  // Simpan user (insert/update)
  async function saveUser() {
    if (!form.nomor || !form.nama) {
      return alert("Nomor & Nama wajib diisi!");
    }

    if (form.id) {
      // Update
      await supabase
        .from("users_wa")
        .update({
          nomor: form.nomor,
          nama: form.nama,
        })
        .eq("id", form.id);
    } else {
      // Insert baru
      await supabase.from("users_wa").insert([
        {
          nomor: form.nomor,
          nama: form.nama,
        },
      ]);
    }

    setForm({ id: null, nomor: "", nama: "" });
    loadUsers();
  }

  // Edit user
  function editUser(u) {
    setForm({
      id: u.id,
      nomor: u.nomor,
      nama: u.nama,
    });
  }

  // Hapus user tanpa konfirmasi
  async function deleteUser(id) {
    const { error } = await supabase.from("users_wa").delete().eq("id", id);
    if (error) {
      console.error("Gagal hapus user:", error.message);
      alert("Gagal hapus user!");
    } else {
      loadUsers();
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">👥 Data Users WA</h2>

      {/* Form Input */}
      <div className="bg-green-50 p-4 rounded-2xl shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          className="border border-green-300 p-2 rounded"
          placeholder="Nomor WA"
          value={form.nomor}
          onChange={(e) => setForm({ ...form, nomor: e.target.value })}
        />
        <input
          className="border border-green-300 p-2 rounded"
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />
        <div className="flex gap-2">
          <button
            onClick={saveUser}
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-4 py-2 rounded"
          >
            {form.id ? "Update" : "Simpan"}
          </button>
          {form.id && (
            <button
              onClick={() => setForm({ id: null, nomor: "", nama: "" })}
              className="bg-gray-400 hover:bg-gray-500 transition text-white font-semibold px-4 py-2 rounded"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg shadow">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="p-2">Nomor</th>
              <th className="p-2">Nama</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-green-50">
                <td className="p-2">{u.nomor}</td>
                <td className="p-2">{u.nama}</td>
                <td className="p-2">
  {u.created_at
    ? new Date(u.created_at).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",   // pastikan pakai zona waktu Jakarta
      })
    : "-"}
</td>

                <td className="p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editUser(u)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Belum ada data user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
