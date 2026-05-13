"use client";

import Link from "next/link";
import { deleteMaintenance } from "@/lib/maintenance";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MaintenanceTableProps {
  items: any[];
}

export default function MaintenanceTable({ items }: MaintenanceTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data maintenance ini?"))
      return;

    try {
      await deleteMaintenance(id);
      toast.success("Data maintenance berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus data");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Barang</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Biaya</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                Belum ada data maintenance.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id.toString()}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.barang?.nama_barang}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        NUP: {item.barang?.nup}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-medium">
                    {item.jenis}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono font-medium">
                  Rp {item.biaya?.toLocaleString("id-ID") ?? 0}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/maintenance/${item.id.toString()}/edit`}>
                        <Edit className="h-4 w-4 text-amber-600" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(item.id.toString())}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
