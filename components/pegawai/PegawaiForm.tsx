"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pegawaiSchema, type PegawaiInput } from "@/lib/zod";
import { createPegawai } from "@/lib/pegawai";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";

export default function PegawaiForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof pegawaiSchema>>({
    resolver: zodResolver(pegawaiSchema),
    defaultValues: {
      nip: "",
      nama: "",
    },
  });

  const onValid = async (data: z.input<typeof pegawaiSchema>) => {
    const fd = new FormData();
    fd.append("nip", data.nip || "");
    fd.append("nama", data.nama);

    const res = await createPegawai(fd);

    if (res.success) {
      toast.success("Pegawai berhasil ditambahkan");
      reset();
      router.push("/pegawai");
    } else {
      toast.error(res.error || "Terjadi kesalahan");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="space-y-4 bg-white p-6 rounded-xl border shadow-sm"
    >
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          NIP (Opsional)
        </label>
        <input
          {...register("nip")}
          placeholder="Masukkan NIP"
          className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Nama Pegawai
        </label>
        <input
          {...register("nama")}
          placeholder="Masukkan nama lengkap"
          className={`w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nama ? "border-red-500" : ""
          }`}
        />
        {errors.nama && (
          <p className="text-red-500 text-xs mt-1">{errors.nama.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold disabled:bg-gray-400 transition"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Pegawai"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
