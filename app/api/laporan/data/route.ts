import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// Fungsi untuk mengubah BigInt menjadi String agar bisa di-JSON-kan
function serializeBigInt(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const startStr = searchParams.get("start");
    const endStr = searchParams.get("end");

    if (!startStr || !endStr) {
      return NextResponse.json(
        { error: "Parameter tanggal tidak lengkap" },
        { status: 400 },
      );
    }

    const start = new Date(startStr);
    const end = new Date(endStr);
    let data: any[] = [];

    if (type === "barang") {
      data = await prisma.barang.findMany({
        orderBy: { kode_barang: "asc" },
      });
    } else if (type === "maintenance") {
      data = await prisma.maintenance.findMany({
        where: { tanggal: { gte: start, lte: end } },
        include: { barang: true },
        orderBy: { tanggal: "asc" },
      });
    } else if (type === "usulan") {
      data = await prisma.usulan.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: { barang: true },
        orderBy: { createdAt: "desc" },
      });
    }

    // Ubah BigInt ke String sebelum dikirim
    return NextResponse.json(serializeBigInt(data));
  } catch (error: any) {
    console.error("DATABASE_ERROR:", error);
    return NextResponse.json(
      { error: "Database Error: " + (error.message || "Unknown error") },
      { status: 500 },
    );
  }
}
