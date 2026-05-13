import { createLokasi } from "@/lib/lokasi";
import { redirect } from "next/navigation";

export default function NewLokasiPage() {
  async function handleAction(fd: FormData) {
    "use server";
    await createLokasi(fd);
    redirect("/lokasi");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tambah Lokasi Baru</h1>
      <form
        action={handleAction}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Kode Ruang</label>
          <input
            name="kode_ruang"
            className="w-full border p-2 rounded"
            placeholder="Contoh: R-01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nama Ruang</label>
          <input
            name="nama_ruang"
            required
            className="w-full border p-2 rounded"
            placeholder="Contoh: Ruang Kepala"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Simpan
          </button>
          <button type="button" className="bg-gray-100 px-4 py-2 rounded">
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
