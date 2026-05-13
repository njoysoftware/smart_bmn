"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconTrash,
  IconCircleCheckFilled,
  IconLoader,
  IconPencil,
  IconSelector,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  deleteBarang,
  bulkUpdateStatus,
  bulkUpdateKondisi,
} from "@/lib/barang";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface BarangRow {
  id: bigint;
  kode_barang: string;
  nup: string;
  nama_barang: string;
  merk: string | null;
  kode_register: string | null;
  status_bmn: string;
  kondisi: string;
}

const getStatusLabel = (s: string) => (s === "Tidak_Aktif" ? "Tidak Aktif" : s);
const getStatusVariant = (
  s: string,
): "default" | "destructive" | "secondary" => {
  if (s === "Aktif") return "default";
  if (s === "Tidak_Aktif") return "destructive";
  return "secondary";
};
const getKondisiVariant = (
  k: string,
): "default" | "destructive" | "secondary" | "outline" => {
  if (k === "Baik") return "default";
  if (k === "Rusak_Ringan" || k === "Rusak Ringan") return "secondary";
  if (k === "Rusak_Berat" || k === "Rusak Berat") return "destructive";
  return "outline";
};
const getKondisiLabel = (k: string) => k.replace(/_/g, " ");

function SortHeader({
  label,
  column,
}: {
  label: string;
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (desc?: boolean) => void;
  };
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" ? (
        <IconSortAscending className="size-3.5" />
      ) : sorted === "desc" ? (
        <IconSortDescending className="size-3.5" />
      ) : (
        <IconSelector className="size-3.5 opacity-40" />
      )}
    </button>
  );
}

export default function BarangTable({ items }: { items: BarangRow[] }) {
  const router = useRouter();
  const [data, setData] = React.useState(() => items);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isPending, startTransition] = React.useTransition();

  const columns: ColumnDef<BarangRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Pilih semua"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Pilih baris"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "kode_barang",
      header: ({ column }) => (
        <SortHeader label="Kode Barang" column={column} />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.kode_barang}</span>
      ),
    },
    {
      accessorKey: "nama_barang",
      header: ({ column }) => (
        <SortHeader label="Nama Barang" column={column} />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nama_barang}</span>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "merk",
      header: ({ column }) => <SortHeader label="Merk" column={column} />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.merk || "-"}
        </span>
      ),
    },
    {
      accessorKey: "status_bmn",
      header: ({ column }) => <SortHeader label="Status BMN" column={column} />,
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status_bmn)}>
          {row.original.status_bmn === "Aktif" ? (
            <IconCircleCheckFilled className="mr-1 size-3" />
          ) : (
            <IconLoader className="mr-1 size-3" />
          )}
          {getStatusLabel(row.original.status_bmn)}
        </Badge>
      ),
    },
    {
      accessorKey: "kondisi",
      header: ({ column }) => <SortHeader label="Kondisi" column={column} />,
      cell: ({ row }) => (
        <Badge variant={getKondisiVariant(row.original.kondisi)}>
          {getKondisiLabel(row.original.kondisi)}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button asChild variant="ghost" size="icon" className="size-8">
          <Link href={`/barang/${row.original.id}/edit`}>
            <IconPencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Link>
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original.id.toString());
  const selectedNames = table
    .getFilteredSelectedRowModel()
    .rows.map((r) => r.original.nama_barang);

  function handleDeleteOne(id: string, nama: string) {
    startTransition(async () => {
      try {
        await deleteBarang(id);
        setData((prev) => prev.filter((item) => item.id.toString() !== id));
        toast.success("Berhasil dihapus", {
          description: `${nama} telah dihapus.`,
        });
        router.refresh();
      } catch {
        toast.error("Gagal menghapus", {
          description: `${nama} tidak dapat dihapus.`,
        });
      }
    });
  }

  function handleBulkDelete() {
    const ids = [...selectedIds];
    const count = ids.length;
    startTransition(async () => {
      try {
        await Promise.all(ids.map((id) => deleteBarang(id)));
        setData((prev) =>
          prev.filter((item) => !ids.includes(item.id.toString())),
        );
        setRowSelection({});
        toast.success("Berhasil dihapus", {
          description: `${count} barang telah dihapus.`,
        });
        router.refresh();
      } catch {
        toast.error("Gagal menghapus", {
          description: "Beberapa barang tidak dapat dihapus.",
        });
      }
    });
  }

  function handleBulkStatus(newStatus: string) {
    startTransition(async () => {
      const res = await bulkUpdateStatus(selectedIds, newStatus);
      if (res.success) {
        toast.success(`Berhasil mengubah ${selectedIds.length} status`);
        setRowSelection({}); // Reset checkbox
        router.refresh();
      }
    });
  }

  function handleBulkKondisi(newKondisi: string) {
    startTransition(async () => {
      const res = await bulkUpdateKondisi(selectedIds, newKondisi);
      if (res.success) {
        toast.success(`Berhasil mengubah ${selectedIds.length} kondisi`);
        setRowSelection({}); // Reset checkbox
        router.refresh();
      }
    });
  }
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Cari barang..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              {/* Dropdown Update Status Masal */}
              <Select onValueChange={handleBulkStatus} disabled={isPending}>
                <SelectTrigger className=" bg-amber-100 text-sm font-bold text-amber-700 uppercase">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Set Aktif</SelectItem>
                  <SelectItem value="Tidak_Aktif">Set Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>

              {/* Dropdown Update Kondisi Masal */}
              <Select onValueChange={handleBulkKondisi} disabled={isPending}>
                <SelectTrigger className=" bg-emerald-100 text-sm font-bold text-emerald-700 uppercase">
                  <SelectValue placeholder="Update Kondisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baik">Set Baik</SelectItem>
                  <SelectItem value="Rusak_Ringan">Set Rusak Ringan</SelectItem>
                  <SelectItem value="Rusak_Berat">Set Rusak Berat</SelectItem>
                </SelectContent>
              </Select>

              {/* Tombol Hapus Masal Tetap Ada */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    className="h-9"
                  >
                    <IconTrash className="mr-2 size-4" />
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                    <AlertDialogDescription>
                      Anda akan menghapus{" "}
                      <span className="font-semibold">
                        {selectedIds.length} barang
                      </span>
                      {selectedNames.length <= 3 && (
                        <> ({selectedNames.join(", ")})</>
                      )}
                      . Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ya, Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className="h-4 w-[1px] bg-border mx-1" />
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="mr-2 size-4" />
                Kolom
                <IconChevronDown className="ml-1 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (col) =>
                    typeof col.accessorFn !== "undefined" && col.getCanHide(),
                )
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                  >
                    {col.id === "kode_barang"
                      ? "Kode Barang"
                      : col.id === "nama_barang"
                        ? "Nama Barang"
                        : col.id === "status_bmn"
                          ? "Status BMN"
                          : col.id.charAt(0).toUpperCase() + col.id.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  {/* Delete per baris via actions col sudah ada, tambah juga shortcut di sini */}
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={isPending}
                        >
                          <IconTrash className="size-4" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hapus{" "}
                            <span className="font-semibold">
                              {row.original.nama_barang}
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteOne(
                                row.original.id.toString(),
                                row.original.nama_barang,
                              )
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-muted-foreground"
                >
                  Belum ada data barang.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="text-sm text-muted-foreground">
          {selectedIds.length > 0 ? (
            <>
              {selectedIds.length} dari{" "}
              {table.getFilteredRowModel().rows.length} dipilih
            </>
          ) : (
            <>
              Total:{" "}
              <span className="font-semibold">
                {table.getFilteredRowModel().rows.length}
              </span>{" "}
              barang
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="page-size"
              className="text-sm text-muted-foreground whitespace-nowrap"
            >
              Baris
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger size="sm" className="w-16" id="page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((s) => (
                  <SelectItem key={s} value={`${s}`}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
