"use client";

import Link from "next/link";
import { deleteUsulan } from "@/lib/usulan";
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
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, FileText, Calendar } from "lucide-react";

export default function UsulanTable({ items }: { items: any[] }) {
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus usulan ini?")) return;
    await deleteUsulan(id);
    toast.success("Usulan berhasil dihapus");
  };

  return (
    <div className="rounded-md border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-bold">Aset / Barang</TableHead>
            <TableHead className="font-bold">Rekomendasi</TableHead>
            <TableHead className="font-bold">Prioritas</TableHead>
            <TableHead className="font-bold text-center">Tahun</TableHead>
            <TableHead className="text-right font-bold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-muted-foreground"
              >
                Belum ada data usulan.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-slate-100 rounded-md">
                      <FileText className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {item.barang?.nama_barang}
                        <span className="ml-2 text-xs font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                          NUP {item.barang?.nup}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 italic">
                        "{item.alasan}"
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="font-semibold text-primary border-primary/30"
                  >
                    {item.jenis_rekomendasi}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`font-bold ${
                      item.prioritas === "Tinggi"
                        ? "bg-red-500 hover:bg-red-600"
                        : item.prioritas === "Sedang"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {item.prioritas}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5 font-medium text-slate-700">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.tahun}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Edit Usulan"
                    >
                      <Link href={`/usulan/${item.id}/edit`}>
                        <Edit className="h-4 w-4 text-amber-600" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:bg-red-50"
                      title="Hapus Usulan"
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
