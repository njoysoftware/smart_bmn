"use client";

import { redirect, useRouter } from "next/navigation";
import { useTransition } from "react";
import { createBarang } from "@/lib/barang";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewBarangPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * Wrapper untuk Server Action.
   * Digunakan agar kita bisa menampilkan toast
   * ketika berhasil atau gagal menyimpan.
   */
  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const namaBarang = (formData.get("nama_barang") as string) || "Barang";

      try {
        // Panggil Server Action
        await createBarang(formData);

        // Toast sukses
        toast.success("Berhasil ditambahkan", {
          description: `${namaBarang} telah ditambahkan.`,
        });

        /**
         * Jika createBarang() TIDAK menggunakan redirect('/barang'),
         * gunakan baris berikut:
         */
        router.push("/barang");
        router.refresh();
      } catch (error) {
        console.error(error);

        // Toast error
        toast.error("Gagal Input", {
          description: `${namaBarang} tidak dapat ditambahkan.`,
        });
      }
    });
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tambah Barang</h1>

      {/* Gunakan wrapper handleSubmit, bukan createBarang langsung */}
      <form action={handleSubmit} className="space-y-5">
        <div className="grid gap-1.5">
          <Label htmlFor="kode_barang">Kode Barang</Label>
          <Input id="kode_barang" name="kode_barang" required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="nup">NUP</Label>
          <Input id="nup" name="nup" />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="nama_barang">Nama Barang</Label>
          <Input id="nama_barang" name="nama_barang" required />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="merk">Merk</Label>
          <Input id="merk" name="merk" />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="kode_register">Kode Register</Label>
          <Input id="kode_register" name="kode_register" />
        </div>

        <div className="grid gap-1.5">
          <Label>Status BMN</Label>
          <Select name="status_bmn" defaultValue="Aktif">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status BMN</SelectLabel>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label>Kondisi</Label>
          <Select name="kondisi" defaultValue="Baik">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Kondisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kondisi</SelectLabel>
                <SelectItem value="Baik">Baik</SelectItem>
                <SelectItem value="Rusak Ringan">Rusak Ringan</SelectItem>
                <SelectItem value="Rusak Berat">Rusak Berat</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex items-center gap-3 pt-2">
          <Button type="submit" className="min-w-[120px]" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>

          <Button
            type="button"
            variant="link"
            className="min-w-[120px]"
            onClick={() => redirect("/barang")}
            disabled={isPending}
          >
            {isPending ? "mengalihkan..." : "Batal"}
          </Button>
        </div>
      </form>
    </div>
  );
}
