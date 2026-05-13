"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { lokasiSchema, normalizeLokasiInput } from "@/lib/zod";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function getLokasis() {
  const data = await prisma.lokasi.findMany({ orderBy: { nama_ruang: "asc" } });
  return data.map((item) => ({ ...item, id: item.id.toString() }));
}

export async function createLokasi(formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const validated = lokasiSchema.parse(raw);
  await prisma.lokasi.create({ data: normalizeLokasiInput(validated) });
  revalidatePath("/lokasi");
}

export async function updateLokasi(id: string, formData: FormData) {
  await requireAuth();
  const raw = Object.fromEntries(formData.entries());
  const validated = lokasiSchema.parse(raw);
  await prisma.lokasi.update({
    where: { id: BigInt(id) },
    data: normalizeLokasiInput(validated),
  });
  revalidatePath("/lokasi");
}

export async function deleteLokasi(id: string) {
  await requireAuth();
  await prisma.lokasi.delete({ where: { id: BigInt(id) } });
  revalidatePath("/lokasi");
}
