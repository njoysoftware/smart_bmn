import { object, string, z } from "zod";

export const LoginSchema = object({
  email: string().email("Email tidak valid"),
  password: string()
    .min(6, "Password harus memiliki minimal 6 karakter")
    .max(32, "Password tidak boleh lebih dari 32 karakter"),
});

export const RegisterSchema = object({
  name: string().min(2, "Name harus memiliki minimal 2 karakter"),
  email: string().email("Email tidak valid"),
  password: string()
    .min(6, "Password harus memiliki minimal 6 karakter")
    .max(32, "Password tidak boleh lebih dari 32 karakter"),
  confirmPassword: string()
    .min(6, "Confirm Password harus memiliki minimal 6 karakter")
    .max(32, "Confirm Password tidak boleh lebih dari 32 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan Confirm Password harus sama",
  path: ["confirmPassword"],
});

// BARANG
const STATUS_BMN = ["Aktif", "Tidak Aktif"] as const;
const KONDISI = ["Baik", "Rusak Ringan", "Rusak Berat"] as const;

export const barangSchema = z.object({
  kode_barang: z.string().min(1, "Kode barang wajib diisi"),
  nup: z.string().optional().default(""),
  nama_barang: z.string().min(1, "Nama barang wajib diisi"),
  merk: z.string().optional().nullable(),
  kode_register: z.string().optional().nullable(),
  // Transform 'Tidak Aktif' → 'Tidak_Aktif' agar cocok dengan enum Prisma
  status_bmn: z
    .enum(STATUS_BMN, { message: "Status BMN tidak valid" })
    .transform(
      (val) =>
        (val === "Tidak Aktif" ? "Tidak_Aktif" : val) as
          | "Aktif"
          | "Tidak_Aktif",
    ),

  kondisi: z
    .enum(KONDISI, { message: "Kondisi tidak valid" })
    .transform(
      (val) => val.replace(" ", "_") as "Baik" | "Rusak_Ringan" | "Rusak_Berat",
    ),

  lokasi_id: z
    .union([z.string(), z.number(), z.bigint()])
    .optional()
    .nullable(),

  pegawai_id: z
    .union([z.string(), z.number(), z.bigint()])
    .optional()
    .nullable(),
});

export const updateBarangSchema = barangSchema;

export type BarangInput = z.infer<typeof barangSchema>;

export function normalizeBarangInput(data: BarangInput) {
  return {
    kode_barang: data.kode_barang,
    nup: data.nup || "",
    nama_barang: data.nama_barang,
    merk: data.merk || null,
    kode_register: data.kode_register || null,
    status_bmn: data.status_bmn, // sudah 'Aktif' | 'Tidak_Aktif'
    kondisi: data.kondisi,
    lokasi_id: data.lokasi_id ? BigInt(data.lokasi_id) : null,
    pegawai_id: data.pegawai_id ? BigInt(data.pegawai_id) : null,
  };
}

// ENUMS
export const KONDISI_LENGKAP = [
  "Baik",
  "Rusak Ringan",
  "Rusak Berat",
  "Dihapus",
] as const;
export const JENIS_REKOMENDASI = [
  "Pengadaan",
  "Penggantian",
  "Penghapusan",
] as const;
export const PRIORITAS = ["Tinggi", "Sedang", "Rendah"] as const;

/* ======================================================
   INSTANSI
====================================================== */
export const instansiSchema = z.object({
  nama_instansi: z.string().min(1, "Nama instansi wajib diisi"),
  alamat: z.string().optional().nullable(),
  telepon: z.string().optional().nullable(),
  email: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .nullable()
    .or(z.literal("")),
  website: z
    .string()
    .url("Format website tidak valid")
    .or(z.literal("")) // Memperbolehkan string kosong
    .nullable() // Memperbolehkan nilai null
    .optional(), // Memperbolehkan field tidak diisi
  logo: z.string().optional().nullable(),
});

export type InstansiInput = z.infer<typeof instansiSchema>;

export function normalizeInstansiInput(data: InstansiInput) {
  return {
    nama_instansi: data.nama_instansi,
    alamat: data.alamat || null,
    telepon: data.telepon || null,
    email: data.email || null,
    website: data.website || null,
    logo: data.logo || null,
  };
}

/* ======================================================
   LOKASI
====================================================== */
export const lokasiSchema = z.object({
  kode_ruang: z.string().optional().nullable(),
  nama_ruang: z.string().min(1, "Nama ruang wajib diisi"),
});

export type LokasiInput = z.infer<typeof lokasiSchema>;

export function normalizeLokasiInput(data: LokasiInput) {
  return {
    kode_ruang: data.kode_ruang || null,
    nama_ruang: data.nama_ruang,
  };
}

/* ======================================================
   PEGAWAI
====================================================== */
export const pegawaiSchema = z.object({
  nip: z.string().optional().nullable(),
  nama: z.string().min(1, "Nama pegawai wajib diisi"),
});

export type PegawaiInput = z.infer<typeof pegawaiSchema>;

export function normalizePegawaiInput(data: PegawaiInput) {
  return {
    nip: data.nip || null,
    nama: data.nama,
  };
}

/* ======================================================
   MAINTENANCE
====================================================== */
export const maintenanceSchema = z.object({
  barang_id: z.union([z.string(), z.number(), z.bigint()]),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jenis: z.string().min(1, "Jenis maintenance wajib diisi"),
  deskripsi: z.string().optional().nullable(),
  // GUNAKAN INI: Memastikan hasil inferensi adalah string | number | null
  biaya: z
    .preprocess(
      (val) => (val === "" ? null : val),
      z.union([z.string(), z.number()]).optional().nullable(),
    )
    .default(null),
  kondisi_setelah: z.enum(KONDISI_LENGKAP, {
    message: "Kondisi tidak valid",
  }),
});

// Pastikan tipe ini diekspor
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;

export function normalizeMaintenanceInput(data: MaintenanceInput) {
  return {
    barang_id: BigInt(data.barang_id),
    tanggal: new Date(data.tanggal),
    jenis: data.jenis,
    deskripsi: data.deskripsi || null,
    biaya: data.biaya ? Number(data.biaya) : null,
    // Kita lakukan replace spasi di sini agar tidak merusak type inference Zod
    kondisi_setelah: data.kondisi_setelah.replace(" ", "_") as any,
  };
}

/* ======================================================
   USULAN
====================================================== */
export const usulanSchema = z.object({
  barang_id: z.union([z.string(), z.number(), z.bigint()]),
  jenis_rekomendasi: z.enum(JENIS_REKOMENDASI, {
    message: "Jenis rekomendasi tidak valid",
  }),
  alasan: z.string().min(1, "Alasan wajib diisi"),
  prioritas: z.enum(PRIORITAS, {
    message: "Prioritas tidak valid",
  }),
  tahun: z.preprocess((val) => Number(val), z.number().min(2000).max(2100)),
});

export type UsulanInput = z.infer<typeof usulanSchema>;

export function normalizeUsulanInput(data: UsulanInput) {
  return {
    barang_id: BigInt(data.barang_id),
    jenis_rekomendasi: data.jenis_rekomendasi,
    alasan: data.alasan,
    prioritas: data.prioritas,
    tahun: data.tahun,
  };
}
