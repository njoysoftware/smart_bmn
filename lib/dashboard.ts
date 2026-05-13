"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { Kondisi, StatusBMN } from "@/lib/generated/prisma/client"; // Pastikan path benar

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  try {
    const [
      totalBarang,
      baik,
      rusakRingan,
      rusakBerat,
      aktif,
      tidakAktif,
      totalMaintenance,
    ] = await Promise.all([
      prisma.barang.count(),
      prisma.barang.count({
        where: { kondisi: Kondisi.Baik }, // Menggunakan enum objek
      }),
      prisma.barang.count({
        where: { kondisi: Kondisi.Rusak_Ringan },
      }),
      prisma.barang.count({
        where: { kondisi: Kondisi.Rusak_Berat },
      }),
      prisma.barang.count({
        where: { status_bmn: StatusBMN.Aktif },
      }),
      prisma.barang.count({
        where: { status_bmn: StatusBMN.Tidak_Aktif },
      }),
      prisma.maintenance.count(),
    ]);

    return {
      totalBarang,
      baik,
      rusakRingan,
      rusakBerat,
      aktif,
      tidakAktif,
      totalMaintenance,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalBarang: 0,
      baik: 0,
      rusakRingan: 0,
      rusakBerat: 0,
      aktif: 0,
      tidakAktif: 0,
      totalMaintenance: 0,
    };
  }
}
