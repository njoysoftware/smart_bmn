// app/barang/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { getBarang } from "@/lib/barang";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BarangTable from "@/components/barang/barang-table";

export default async function BarangPage() {
  const items = await getBarang();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">
              Daftar Barang
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola data inventaris barang BMN.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/barang/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Barang
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <BarangTable items={items ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
