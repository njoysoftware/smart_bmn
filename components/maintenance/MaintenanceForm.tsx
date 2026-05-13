"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceSchema, KONDISI_LENGKAP } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Gunakan z.input agar tipe data biaya cocok dengan input HTML (string)
type MaintenanceFormInput = z.input<typeof maintenanceSchema>;

export default function MaintenanceForm({
  barangs,
  onSubmit,
  initialData,
}: {
  barangs: any[];
  onSubmit: (fd: FormData) => void;
  initialData?: any;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Tambahkan isSubmitting untuk UX
  } = useForm<MaintenanceFormInput>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: initialData || {
      barang_id: "",
      tanggal: new Date().toISOString().split("T")[0],
      jenis: "",
      biaya: "",
      kondisi_setelah: "Baik",
      deskripsi: "",
    },
  });

  const onValid = (data: MaintenanceFormInput) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      // Pastikan nilai tidak null/undefined sebelum di-append
      if (v !== null && v !== undefined) {
        fd.append(k, v.toString());
      }
    });
    onSubmit(fd);
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="space-y-4 bg-white p-6 rounded-lg shadow border"
    >
      <div>
        <label className="block text-sm font-bold mb-1">Aset / Barang</label>
        <select
          {...register("barang_id")}
          className={`w-full border p-2 rounded shadow-sm ${errors.barang_id ? "border-red-500" : ""}`}
        >
          <option value="">-- Pilih Barang --</option>
          {barangs.map((b) => (
            <option key={b.id.toString()} value={b.id.toString()}>
              {b.nama_barang} (NUP: {b.nup})
            </option>
          ))}
        </select>
        {errors.barang_id && (
          <p className="text-red-500 text-xs mt-1">
            {errors.barang_id.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Tanggal</label>
          <input
            type="date"
            {...register("tanggal")}
            className="w-full border p-2 rounded"
          />
          {errors.tanggal && (
            <p className="text-red-500 text-xs mt-1">
              {errors.tanggal.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">
            Jenis Maintenance
          </label>
          <input
            {...register("jenis")}
            placeholder="Contoh: Perbaikan Layar"
            className="w-full border p-2 rounded"
          />
          {errors.jenis && (
            <p className="text-red-500 text-xs mt-1">{errors.jenis.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Biaya (Rp)</label>
        <input
          type="number"
          {...register("biaya")}
          className="w-full border p-2 rounded"
          placeholder="0"
        />
        {errors.biaya && (
          <p className="text-red-500 text-xs mt-1">{errors.biaya.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">
          Kondisi Setelah Maintenance
        </label>
        <select
          {...register("kondisi_setelah")}
          className="w-full border p-2 rounded"
        >
          {KONDISI_LENGKAP.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">Keterangan</label>
        <textarea
          {...register("deskripsi")}
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="Detail singkat..."
        ></textarea>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2 rounded font-bold transition"
        >
          {isSubmitting ? "Memproses..." : "Simpan"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.back()}
          className="bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
