import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseclient";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nomor: "",
    nama: "",
  });
  const [search, setSearch] = useState("");

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

  // 🔍 Filter data berdasarkan search
  const filteredUsers = users.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.nomor.toLowerCase().includes(search.toLowerCase())
  );

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
            className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            {form.id ? "Update" : "Simpan"}
          </button>
          {form.id && (
            <button
              onClick={() => setForm({ id: null, nomor: "", nama: "" })}
              className="bg-gray-500 hover:bg-gray-600 transition text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Cari nama atau nomor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2"
        />
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg shadow overflow-hidden">
          <thead>
            <tr className="bg-green-100 text-black">
              <th className="p-3 text-left">Nomor</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t hover:bg-green-50">
                <td className="p-3">{u.nomor}</td>
                <td className="p-3">{u.nama}</td>
                <td className="p-3">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })
                    : "-"}
                </td>
                <td className="p-3 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editUser(u)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow text-sm"
                  >
                    🗑️ Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
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
