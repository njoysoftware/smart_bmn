// app/api/import-barang/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { StatusBMN, Kondisi } from "@/lib/generated/prisma/client";
import * as XLSX from "xlsx";

// Paksa Node.js runtime — WAJIB agar XLSX dan Prisma bekerja di Vercel
export const runtime = "nodejs";
export const maxDuration = 60; // max 60 detik untuk file besar

interface ImportRow {
  kode_barang: string;
  nup: string;
  nama_barang: string;
  merk: string | null;
  status_bmn: string;
  kode_lokasi: string | null;
  nama_lokasi: string | null;
  kondisi: string;
  nip_pengguna: string | null;
  nama_pengguna: string | null;
}

function mapStatus(val: string): StatusBMN {
  const v = (val ?? "").trim().toLowerCase();
  if (v === "tidak aktif" || v === "tidak_aktif") return StatusBMN.Tidak_Aktif;
  return StatusBMN.Aktif;
}

function mapKondisi(val: string): Kondisi {
  const v = (val ?? "").trim().toLowerCase();
  if (v === "rusak ringan" || v === "rusak_ringan") return Kondisi.Rusak_Ringan;
  if (v === "rusak berat" || v === "rusak_berat") return Kondisi.Rusak_Berat;
  if (v === "dihapus") return Kondisi.Dihapus;
  return Kondisi.Baik;
}

function safeStr(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "number") return String(val);
  return String(val).trim();
}

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Baca file dari multipart form
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    // Validasi tipe file
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/octet-stream",
    ];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (
      !["xlsx", "xls"].includes(ext ?? "") &&
      !validTypes.includes(file.type)
    ) {
      return NextResponse.json(
        { error: "Format file harus .xlsx atau .xls" },
        { status: 400 },
      );
    }

    // Validasi ukuran — max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 },
      );
    }

    // Parse Excel — pakai ArrayBuffer agar aman di Vercel
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });

    if (!wb.SheetNames.length) {
      return NextResponse.json({ error: "File Excel kosong" }, { status: 400 });
    }

    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    if (raw.length < 2) {
      return NextResponse.json(
        { error: "Tidak ada data. Pastikan data dimulai dari baris ke-2." },
        { status: 400 },
      );
    }

    // Validasi header
    const EXPECTED = [
      "Kode Barang",
      "NUP",
      "Nama Barang",
      "Merk",
      "Status",
      "Kode Lokasi",
      "Nama Lokasi",
      "Kondisi",
      "NIP Pengguna",
      "Nama Pengguna",
    ];
    const headers = (raw[0] as string[]).map((h) => safeStr(h));
    const missing = EXPECTED.filter((h) => !headers.includes(h));
    if (missing.length) {
      return NextResponse.json(
        {
          error: `Kolom tidak sesuai template. Kolom hilang: ${missing.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const idx = (name: string) => headers.indexOf(name);

    // Parse rows
    const rows: ImportRow[] = [];
    for (let i = 1; i < raw.length; i++) {
      const r = raw[i] as unknown[];
      const kode = safeStr(r[idx("Kode Barang")]);
      if (!kode) continue;
      rows.push({
        kode_barang: kode,
        nup: safeStr(r[idx("NUP")]),
        nama_barang: safeStr(r[idx("Nama Barang")]),
        merk: safeStr(r[idx("Merk")]) || null,
        status_bmn: safeStr(r[idx("Status")]) || "Aktif",
        kode_lokasi: safeStr(r[idx("Kode Lokasi")]) || null,
        nama_lokasi: safeStr(r[idx("Nama Lokasi")]) || null,
        kondisi: safeStr(r[idx("Kondisi")]) || "Baik",
        nip_pengguna: safeStr(r[idx("NIP Pengguna")]) || null,
        nama_pengguna: safeStr(r[idx("Nama Pengguna")]) || null,
      });
    }

    if (!rows.length) {
      return NextResponse.json(
        { error: "Tidak ada data valid ditemukan di file." },
        { status: 400 },
      );
    }

    // Import ke database
    let success = 0;
    const errors: { row: number; kode: string; reason: string }[] = [];

    // Cache lokasi & pegawai agar tidak query berulang
    const lokasiCache = new Map<string, bigint>();
    const pegawaiCache = new Map<string, bigint>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      if (!row.nama_barang) {
        errors.push({
          row: rowNum,
          kode: row.kode_barang,
          reason: "Nama barang wajib diisi",
        });
        continue;
      }

      try {
        // Resolve lokasi
        let lokasi_id: bigint | null = null;
        if (row.nama_lokasi) {
          const cacheKey = row.nama_lokasi.toLowerCase();
          if (lokasiCache.has(cacheKey)) {
            lokasi_id = lokasiCache.get(cacheKey)!;
          } else {
            const lokasi = await prisma.lokasi.upsert({
              where: { nama_ruang: row.nama_lokasi },
              update: {},
              create: {
                nama_ruang: row.nama_lokasi,
                kode_ruang: row.kode_lokasi,
              },
            });
            lokasiCache.set(cacheKey, lokasi.id);
            lokasi_id = lokasi.id;
          }
        }

        // Resolve pegawai
        let pegawai_id: bigint | null = null;
        const nip = row.nip_pengguna;
        const nama = row.nama_pengguna;

        if (nip || nama) {
          const cacheKey = nip ?? nama!;

          if (pegawaiCache.has(cacheKey)) {
            pegawai_id = pegawaiCache.get(cacheKey)!;
          } else {
            let pegawai;
            if (nip) {
              pegawai = await prisma.pegawai.upsert({
                where: { nip },
                update: { nama: nama ?? "" },
                create: { nip, nama: nama ?? "" },
              });
            } else {
              pegawai =
                (await prisma.pegawai.findFirst({ where: { nama: nama! } })) ??
                (await prisma.pegawai.create({ data: { nama: nama! } }));
            }

            pegawaiCache.set(cacheKey, pegawai.id);
            pegawai_id = pegawai.id;
          }
        }

        // Upsert barang
        await prisma.barang.upsert({
          where: {
            kode_barang_nup: {
              kode_barang: row.kode_barang,
              nup: row.nup,
            },
          },
          update: {
            nama_barang: row.nama_barang,
            merk: row.merk,
            status_bmn: mapStatus(row.status_bmn),
            kondisi: mapKondisi(row.kondisi),
            lokasi_id,
            pegawai_id,
          },
          create: {
            kode_barang: row.kode_barang,
            nup: row.nup,
            nama_barang: row.nama_barang,
            merk: row.merk,
            status_bmn: mapStatus(row.status_bmn),
            kondisi: mapKondisi(row.kondisi),
            lokasi_id,
            pegawai_id,
          },
        });
        success++;
      } catch (err) {
        errors.push({
          row: rowNum,
          kode: row.kode_barang,
          reason: err instanceof Error ? err.message : "Gagal menyimpan",
        });
      }
    }

    revalidatePath("/barang");

    return NextResponse.json({
      success,
      skipped: 0,
      errors,
      total: rows.length,
    });
  } catch (err) {
    console.error("[import-barang]", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
