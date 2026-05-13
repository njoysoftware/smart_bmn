"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { instansiSchema, normalizeInstansiInput } from "@/lib/zod";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function getInstansi() {
  // Mengambil satu data pertama
  return await prisma.instansi.findFirst();
}

export async function saveInstansi(formData: FormData) {
  await requireAuth();

  const rawData = Object.fromEntries(formData.entries());
  const validated = instansiSchema.parse(rawData);
  const data = normalizeInstansiInput(validated);

  // Cari data pertama untuk mendapatkan ID-nya
  const existing = await prisma.instansi.findFirst();

  if (existing) {
    // Jika sudah ada, UPDATE
    await prisma.instansi.update({
      where: { id: existing.id },
      data,
    });
  } else {
    // Jika belum ada, CREATE
    await prisma.instansi.create({
      data,
    });
  }

  revalidatePath("/instansi");
  return { success: true };
}
