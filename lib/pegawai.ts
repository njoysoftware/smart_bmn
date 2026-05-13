"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { pegawaiSchema, normalizePegawaiInput } from "@/lib/zod";

async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export async function getPegawais() {
  const data = await prisma.pegawai.findMany({
    orderBy: { nama: "asc" },
  });
  // Konversi BigInt ke string agar bisa dikirim ke Client Component
  return data.map((item) => ({
    ...item,
    id: item.id.toString(),
  }));
}

export async function createPegawai(formData: FormData) {
  await requireAuth();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validated = pegawaiSchema.parse(rawData);
    const data = normalizePegawaiInput(validated);

    await prisma.pegawai.create({ data });

    revalidatePath("/pegawai");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal menambahkan pegawai" };
  }
}

export async function deletePegawai(id: string) {
  await requireAuth();
  try {
    await prisma.pegawai.delete({
      where: { id: BigInt(id) },
    });
    revalidatePath("/pegawai");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Data gagal dihapus" };
  }
}
