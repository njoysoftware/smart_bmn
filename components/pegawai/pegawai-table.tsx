"use client";

import { deletePegawai } from "@/lib/pegawai";
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
import { Trash2, User } from "lucide-react";

interface PegawaiTableProps {
  items: any[];
}

export default function PegawaiTable({ items }: PegawaiTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) return;

    const res = await deletePegawai(id);
    if (res.success) {
      toast.success("Pegawai berhasil dihapus");
    } else {
      toast.error(res.error || "Gagal menghapus data");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[50px] text-center">#</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>Nama Pegawai</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                Belum ada data pegawai.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="text-center font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {item.nip || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold">{item.nama}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
