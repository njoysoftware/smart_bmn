import Link from "next/link";
import { Plus } from "lucide-react";
import { getMaintenances } from "@/lib/maintenance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MaintenanceTable from "@/components/maintenance/maintenance-table";

export default async function MaintenanceListPage() {
  const data = await getMaintenances();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Riwayat Maintenance
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola pemeliharaan dan perbaikan aset BMN.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/maintenance/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Riwayat
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {/* Komponen Tabel Client */}
          <MaintenanceTable items={data ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
