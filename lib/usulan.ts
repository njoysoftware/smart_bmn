"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { usulanSchema, normalizeUsulanInput } from "@/lib/zod";
import { JenisRekomendasi, Prioritas } from "@/lib/generated/prisma/client";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function getUsulans() {
  await requireAuth();
  const data = await prisma.usulan.findMany({
    include: { barang: true },
    orderBy: { createdAt: "desc" },
  });
  return data.map((item) => ({ ...item, id: item.id.toString() }));
}

export async function createUsulan(formData: FormData) {
  await requireAuth();
  try {
    const raw = Object.fromEntries(formData.entries());
    const validated = usulanSchema.parse(raw);
    const normalized = normalizeUsulanInput(validated);

    await prisma.usulan.create({
      data: {
        ...normalized,
        jenis_rekomendasi: normalized.jenis_rekomendasi as JenisRekomendasi,
        prioritas: normalized.prioritas as Prioritas,
      },
    });
    revalidatePath("/usulan");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal membuat usulan" };
  }
}

export async function updateUsulan(id: string, formData: FormData) {
  await requireAuth();
  try {
    const raw = Object.fromEntries(formData.entries());
    const validated = usulanSchema.parse(raw);
    const normalized = normalizeUsulanInput(validated);

    await prisma.usulan.update({
      where: { id: BigInt(id) },
      data: {
        ...normalized,
        jenis_rekomendasi: normalized.jenis_rekomendasi as JenisRekomendasi,
        prioritas: normalized.prioritas as Prioritas,
      },
    });
    revalidatePath("/usulan");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui usulan" };
  }
}

export async function deleteUsulan(id: string) {
  await requireAuth();
  await prisma.usulan.delete({ where: { id: BigInt(id) } });
  revalidatePath("/usulan");
}
