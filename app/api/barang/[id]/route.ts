import { prisma } from '@/prisma'
import { NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params

  const data = await prisma.barang.findUnique({
    where: {
      id: BigInt(id),
    },
  })

  if (!data) {
    return NextResponse.json(
      { message: 'Data tidak ditemukan' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  const { id } = await params
  const body = await req.json()

  const data = await prisma.barang.update({
    where: {
      id: BigInt(id),
    },
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

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params

  await prisma.barang.delete({
    where: {
      id: BigInt(id),
    },
  })

  return NextResponse.json({
    success: true,
  })
}