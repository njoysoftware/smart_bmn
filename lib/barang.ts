"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Prisma, StatusBMN, Kondisi } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { barangSchema, normalizeBarangInput } from "@/lib/zod";

// ---- helpers ----
function extractRawBarang(formData: FormData) {
  return {
    kode_barang: formData.get("kode_barang"),
    nup: formData.get("nup"),
    nama_barang: formData.get("nama_barang"),
    merk: formData.get("merk"),
    kode_register: formData.get("kode_register"),
    status_bmn: formData.get("status_bmn"),
    kondisi: formData.get("kondisi"),
    lokasi_id: formData.get("lokasi_id"),
    pegawai_id: formData.get("pegawai_id"),
  };
}

function buildPayload(formData: FormData) {
  const validated = barangSchema.parse(extractRawBarang(formData));
  const normalized = normalizeBarangInput(validated);
  return {
    ...normalized,
    status_bmn: normalized.status_bmn as StatusBMN, // 👈  enum Status
    kondisi: normalized.kondisi as Kondisi, // 👈 enum kondisi
  } as Prisma.BarangUncheckedCreateInput;
}

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

// ---- actions ----
/**
 * GET
 */
export const getBarang = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  try {
    const barang = await prisma.barang.findMany({
      include: {
        lokasi: true,
        pegawai: true,
      },
      orderBy: { kode_barang: "asc" },
    });
    return barang;
  } catch (error) {
    console.error("Error fetching barang:", error);
  }
};
export async function getBarangById(id: string) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const barang = await prisma.barang.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        lokasi: true,
        pegawai: true,
      },
    });

    return barang;
  } catch (error) {
    console.error("Error fetching barang by id:", error);
    return null;
  }
}

/**
 * CREATE
 */
export const createBarang = async (formData: FormData) => {
  await requireAuth();

  try {
    const payload = buildPayload(formData);
    const barang = await prisma.barang.create({ data: payload });
    revalidatePath("/barang");
    return {
      success: true,
      data: {
        ...barang,
        // BigInt tidak bisa dikirim ke client, ubah ke string
        id: barang.id.toString(),
      },
    };
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error("Data tidak valid: " + err.message);
    }
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        success: false,
        error:
          "Kode Barang dan NUP sudah terdaftar. Gunakan kombinasi yang berbeda.",
      };
    }
    console.error("Create Barang Error:", err);

    return {
      success: false,
      error: "Terjadi kesalahan saat menyimpan data.",
    };
  }
};

/**
 * UPDATE
 */
export async function updateBarang(id: string, formData: FormData) {
  await requireAuth();

  try {
    const payload = buildPayload(formData);
    await prisma.barang.update({
      where: { id: BigInt(id) },
      data: payload,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error("Data tidak valid: " + err.message);
    }
    throw err;
  }

  revalidatePath("/barang");
  revalidatePath(`/barang/${id}/edit`);
  redirect("/barang");
}

/**
 * DELETE
 */
export async function deleteBarang(id: string) {
  await requireAuth();

  try {
    await prisma.barang.delete({
      where: { id: BigInt(id) },
    });
  } catch (err) {
    throw new Error("Gagal menghapus barang.");
  }

  revalidatePath("/barang");
}
