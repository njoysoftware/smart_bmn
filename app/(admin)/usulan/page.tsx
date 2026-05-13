import Link from "next/link";
import { Plus } from "lucide-react";
import { getUsulans } from "@/lib/usulan";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UsulanTable from "@/components/usulan/usulan-table";

export default async function UsulanPage() {
  const items = await getUsulans();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight text-primary">
              Usulan Aset
            </CardTitle>
            <CardDescription className="mt-1">
              Kelola rekomendasi pengadaan, penggantian, dan penghapusan BMN.
            </CardDescription>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/usulan/new">
              <Plus className="mr-2 h-4 w-4" /> Tambah Usulan
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <UsulanTable items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
