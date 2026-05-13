"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usulanSchema, JENIS_REKOMENDASI, PRIORITAS } from "@/lib/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";

type UsulanFormInput = z.input<typeof usulanSchema>;

export default function UsulanForm({ barangs, onSubmit, initialData }: any) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsulanFormInput>({
    resolver: zodResolver(usulanSchema),
    defaultValues: initialData || {
      tahun: new Date().getFullYear(),
    },
  });

  const onValid = (data: UsulanFormInput) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
    onSubmit(fd);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <form
        onSubmit={handleSubmit(onValid)}
        className="space-y-8 bg-white p-10 rounded-2xl border border-slate-200 shadow-xl"
      >
        <div className="space-y-1 border-b pb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Detail Usulan Aset
          </h2>
          <p className="text-slate-500 text-sm">
            Lengkapi formulir di bawah untuk mengajukan usulan pengelolaan BMN.
          </p>
        </div>

        {/* Pemilihan Aset */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
            Pilih Aset / Barang
          </label>
          <select
            {...register("barang_id")}
            className={`w-full border-2 p-3 rounded-xl bg-slate-50 transition-all focus:ring-4 focus:ring-blue-100 outline-none appearance-none cursor-pointer ${
              errors.barang_id
                ? "border-red-500"
                : "border-slate-200 focus:border-blue-500"
            }`}
          >
            <option value="">-- Cari dan Pilih Barang --</option>
            {barangs.map((b: any) => (
              <option key={b.id.toString()} value={b.id.toString()}>
                {b.nama_barang} [NUP: {b.nup}]
              </option>
            ))}
          </select>
          {errors.barang_id && (
            <p className="text-red-500 text-xs font-medium animate-pulse">
              {errors.barang_id.message}
            </p>
          )}
        </div>

        {/* Grid: Jenis & Prioritas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
              Jenis Rekomendasi
            </label>
            <select
              {...register("jenis_rekomendasi")}
              className="w-full border-2 border-slate-200 p-3 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            >
              {JENIS_REKOMENDASI.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
              Tingkat Prioritas
            </label>
            <select
              {...register("prioritas")}
              className="w-full border-2 border-slate-200 p-3 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            >
              {PRIORITAS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tahun Anggaran */}
        <div className="space-y-3 max-w-[200px]">
          <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
            Tahun Anggaran
          </label>
          <input
            type="number"
            {...register("tahun")}
            className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none font-semibold transition-all"
            placeholder="2024"
          />
          {errors.tahun && (
            <p className="text-red-500 text-xs font-medium">
              {errors.tahun.message}
            </p>
          )}
        </div>

        {/* Alasan */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
            Alasan & Justifikasi
          </label>
          <textarea
            {...register("alasan")}
            className={`w-full border-2 p-4 rounded-xl focus:ring-4 focus:ring-blue-100 outline-none transition-all ${
              errors.alasan
                ? "border-red-500"
                : "border-slate-200 focus:border-blue-500"
            }`}
            rows={5}
            placeholder="Tuliskan alasan mendetail mengapa barang ini direkomendasikan..."
          />
          {errors.alasan && (
            <p className="text-red-500 text-xs font-medium">
              {errors.alasan.message}
            </p>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 h-12 rounded-xl text-slate-600 font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Batal
          </Button>
          <Button
            disabled={isSubmitting}
            type="submit"
            className="px-10 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {isSubmitting ? (
              "Memproses..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Simpan Usulan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
