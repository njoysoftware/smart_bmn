"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { StatusBMN, Kondisi } from "@/lib/generated/prisma/client";

export interface ImportRow {
  kode_barang: string;
  nup: string;
  nama_barang: string;
  merk: string | null;
  status_bmn: string;
  kode_lokasi: string | null;
  nama_lokasi: string | null;
  kondisi: string;
  nip_pengguna: string | null;
  nama_pengguna: string;
}

export interface ImportResult {
  success: number;
  skipped: number;
  errors: { row: number; kode: string; reason: string }[];
}

// Map nilai Excel → enum Prisma
function mapStatus(val: string): StatusBMN {
  const v = val?.trim().toLowerCase();
  if (v === "tidak aktif" || v === "tidak_aktif") return StatusBMN.Tidak_Aktif;
  return StatusBMN.Aktif;
}

function mapKondisi(val: string): Kondisi {
  const v = val?.trim().toLowerCase();
  if (v === "rusak ringan" || v === "rusak_ringan") return Kondisi.Rusak_Ringan;
  if (v === "rusak berat" || v === "rusak_berat") return Kondisi.Rusak_Berat;
  if (v === "dihapus") return Kondisi.Dihapus;
  return Kondisi.Baik;
}

export async function importBarangAction(
  rows: ImportRow[],
): Promise<ImportResult> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const result: ImportResult = { success: 0, skipped: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 karena header di baris 1

    // Validasi field wajib
    if (!row.kode_barang?.trim() || !row.nama_barang?.trim()) {
      result.errors.push({
        row: rowNum,
        kode: row.kode_barang || "-",
        reason: "Kode barang dan nama barang wajib diisi",
      });
      continue;
    }

    try {
      // Cari atau buat Lokasi
      let lokasi_id: bigint | null = null;
      if (row.nama_lokasi?.trim()) {
        const lokasi = await prisma.lokasi.upsert({
          where: { nama_ruang: row.nama_lokasi!.trim() },
          update: { kode_ruang: row.kode_lokasi?.trim() || null },
          create: {
            nama_ruang: row.nama_lokasi!.trim(),
            kode_ruang: row.kode_lokasi?.trim() || null,
          },
        });
        lokasi_id = lokasi.id;
      }

      // Cari atau buat Pegawai
      let pegawai_id: bigint | null = null;
      if (row.nip_pengguna?.trim()) {
        const pegawai =
          (await prisma.pegawai.findFirst({
            where: { nama: row.nama_pengguna.trim() },
          })) ??
          (await prisma.pegawai.create({
            data: { nama: row.nama_pengguna.trim() },
          }));
        pegawai_id = pegawai.id;
      }

      // Upsert Barang (skip kalau kode+nup sudah ada)
      await prisma.barang.upsert({
        where: {
          kode_barang_nup: {
            kode_barang: row.kode_barang.trim(),
            nup: row.nup?.trim() || "",
          },
        },
        update: {
          nama_barang: row.nama_barang.trim(),
          merk: row.merk?.trim() || null,
          status_bmn: mapStatus(row.status_bmn),
          kondisi: mapKondisi(row.kondisi),
          lokasi_id,
          pegawai_id,
        },
        create: {
          kode_barang: row.kode_barang.trim(),
          nup: row.nup?.trim() || "",
          nama_barang: row.nama_barang.trim(),
          merk: row.merk?.trim() || null,
          status_bmn: mapStatus(row.status_bmn),
          kondisi: mapKondisi(row.kondisi),
          lokasi_id,
          pegawai_id,
        },
      });

      result.success++;
    } catch (err: unknown) {
      result.errors.push({
        row: rowNum,
        kode: row.kode_barang,
        reason: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  revalidatePath("/barang");
  return result;
}
