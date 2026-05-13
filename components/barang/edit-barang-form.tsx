"use client";

import { redirect, useRouter } from "next/navigation";
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
import { toast } from "sonner";

interface Barang {
  id: bigint;
  kode_barang: string;
  nup: string;
  nama_barang: string;
  merk: string | null;
  kode_register: string | null;
  status_bmn: string;
  kondisi: string;
}

interface EditBarangFormProps {
  action: (formData: FormData) => Promise<void>;
  barang: Barang;
}

export default function EditBarangForm({
  action,
  barang,
}: EditBarangFormProps) {
  const router = useRouter();

  // Normalize status_bmn dari Prisma ('Tidak_Aktif') ke display value ('Tidak Aktif')
  const statusBMN =
    barang.status_bmn === "Tidak_Aktif" ? "Tidak Aktif" : barang.status_bmn;

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-1.5">
        <Label htmlFor="kode_barang">Kode Barang</Label>
        <Input
          id="kode_barang"
          name="kode_barang"
          defaultValue={barang.kode_barang}
          placeholder="Contoh: 3.06.01.06.001"
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="nup">NUP</Label>
        <Input
          id="nup"
          name="nup"
          defaultValue={barang.nup}
          placeholder="Nomor Urut Pendaftaran"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="nama_barang">Nama Barang</Label>
        <Input
          id="nama_barang"
          name="nama_barang"
          defaultValue={barang.nama_barang}
          placeholder="Contoh: Laptop Dell Latitude"
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="merk">Merk</Label>
        <Input
          id="merk"
          name="merk"
          defaultValue={barang.merk ?? ""}
          placeholder="Contoh: Dell, HP, Lenovo"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="kode_register">Kode Register</Label>
        <Input
          id="kode_register"
          name="kode_register"
          defaultValue={barang.kode_register ?? ""}
          placeholder="Kode register barang"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="status_bmn">Status BMN</Label>
        <Select name="status_bmn" defaultValue={statusBMN}>
          <SelectTrigger id="status_bmn" className="w-full">
            <SelectValue placeholder="Pilih Status BMN" />
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
        <Label htmlFor="kondisi">Kondisi</Label>
        <Select name="kondisi" defaultValue={barang.kondisi}>
          <SelectTrigger id="kondisi" className="w-full">
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
        <Button type="submit" className="min-w-[120px]">
          Simpan
        </Button>

        <Button
          type="button"
          variant="link"
          className="min-w-[120px]"
          onClick={() => redirect("/barang")}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
