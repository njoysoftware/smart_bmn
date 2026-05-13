"use client";

import { toast } from "sonner";
import { saveInstansi } from "@/lib/instansi";

export default function InstansiForm({ initialData }: { initialData: any }) {
  async function action(fd: FormData) {
    const result = await saveInstansi(fd);

    if (result.success) {
      toast.success("Profil instansi berhasil diperbarui!");
    } else {
      toast.error("Gagal menyimpan data.");
    }
  }

  return (
    <form
      action={action}
      className="bg-white p-8 rounded-xl shadow-sm border space-y-6"
    >
      {/* Salin seluruh isi form dari page.tsx sebelumnya di sini */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Nama Instansi
        </label>
        <input
          name="nama_instansi"
          defaultValue={initialData?.nama_instansi || ""}
          className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Alamat
        </label>
        <textarea
          name="alamat"
          defaultValue={initialData?.alamat || ""}
          rows={3}
          placeholder="Alamat lengkap kantor..."
          className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition"
        />
      </div>

      {/* Baris Telepon & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Telepon
          </label>
          <input
            name="telepon"
            defaultValue={initialData?.telepon || ""}
            placeholder="021-xxxxxx"
            className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            defaultValue={initialData?.email || ""}
            placeholder="instansi@go.id"
            className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Website (URL)
        </label>
        <input
          name="website"
          defaultValue={initialData?.website || ""}
          placeholder="https://www.instansi.go.id"
          className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
      >
        Simpan Profil
      </button>
    </form>
  );
}
