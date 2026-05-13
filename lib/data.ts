import { auth } from '@/auth'
import {prisma} from '@/prisma'
import { redirect } from 'next/navigation'

export const getBarang = async () => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
try {
const barang = await prisma.barang.findMany({
        include: {
            lokasi: true,
            pegawai: true
        },
          orderBy: { id: 'desc' },
    });
    return barang;  
}catch (error) {
    console.error("Error fetching barang:", error);
    }

}

export async function getBarangById(id: string) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
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
    })

    return barang
  } catch (error) {
    console.error('Error fetching barang by id:', error)
    return null
  }
}
