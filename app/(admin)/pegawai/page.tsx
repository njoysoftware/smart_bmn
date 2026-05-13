import Link from "next/link";
import { Plus } from "lucide-react";
import { getPegawais } from "@/lib/pegawai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PegawaiTable from "@/components/pegawai/pegawai-table";

export default async function PegawaiPage() {
  const items = await getPegawais();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Daftar Pegawai
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola data penanggung jawab aset BMN.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/pegawai/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pegawai
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {/* Komponen Tabel yang akan kita buat di bawah */}
          <PegawaiTable items={items ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
