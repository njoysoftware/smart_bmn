"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Prisma, Kondisi } from "@/lib/generated/prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { maintenanceSchema, normalizeMaintenanceInput } from "@/lib/zod";

// ---- helpers ----
function extractRawMaintenance(formData: FormData) {
  return {
    barang_id: formData.get("barang_id"),
    tanggal: formData.get("tanggal"),
    jenis: formData.get("jenis"),
    deskripsi: formData.get("deskripsi"),
    biaya: formData.get("biaya"),
    kondisi_setelah: formData.get("kondisi_setelah"),
  };
}

function buildPayload(formData: FormData) {
  const validated = maintenanceSchema.parse(extractRawMaintenance(formData));
  const normalized = normalizeMaintenanceInput(validated);
  return {
    ...normalized,
    kondisi_setelah: normalized.kondisi_setelah as Kondisi,
  } as Prisma.MaintenanceUncheckedCreateInput;
}

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

// ---- actions ----

export const getMaintenances = async () => {
  await requireAuth();
  try {
    return await prisma.maintenance.findMany({
      include: { barang: true },
      orderBy: { tanggal: "desc" },
    });
  } catch (error) {
    console.error("Error fetching maintenance:", error);
    return [];
  }
};

export const createMaintenance = async (formData: FormData) => {
  await requireAuth();
  try {
    const payload = buildPayload(formData);
    const maintenance = await prisma.maintenance.create({ data: payload });
    revalidatePath("/maintenance");
    return { success: true, id: maintenance.id.toString() };
  } catch (err) {
    if (err instanceof ZodError) throw new Error("Data tidak valid");
    console.error(err);
    return { success: false, error: "Gagal menyimpan data." };
  }
};

export async function deleteMaintenance(id: string) {
  await requireAuth();
  try {
    await prisma.maintenance.delete({ where: { id: BigInt(id) } });
    revalidatePath("/maintenance");
  } catch (err) {
    throw new Error("Gagal menghapus data.");
  }
}
