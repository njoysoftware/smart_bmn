import { prisma } from '@/prisma'
import { NextResponse } from 'next/server'
import { barangSchema,BarangInput, normalizeBarangInput, updateBarangSchema } from "@/lib/zod";
export async function GET() {
  const data = await prisma.barang.findMany({
    orderBy: {
      id: 'desc',
    },
  })

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()

  const data = await prisma.barang.create({
    data: {
      kode_barang: body.kode_barang,
      nup: body.nup || '',
      nama_barang: body.nama_barang,
      merk: body.merk || null,
      kode_register: body.kode_register || null,
      status_bmn: body.status_bmn,
      kondisi: body.kondisi,
    },
  })

  return NextResponse.json(data)
}