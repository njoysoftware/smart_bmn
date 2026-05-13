"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import Link from "next/link";
import {
  IconUpload,
  IconFileSpreadsheet,
  IconCircleCheckFilled,
  IconAlertCircle,
  IconX,
  IconDownload,
  IconLoader2,
} from "@tabler/icons-react";
import {
  importBarangAction,
  type ImportRow,
  type ImportResult,
} from "@/lib/import-barang";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EXPECTED_HEADERS = [
  "Kode Barang",
  "NUP",
  "Nama Barang",
  "Merk",
  "Status",
  "Kode Lokasi",
  "Nama Lokasi",
  "Kondisi",
  "NIP Pengguna",
  "Nama Pengguna",
];

type Step = "idle" | "preview" | "importing" | "done";

export default function ImportBarangClient() {
  const [step, setStep] = React.useState<Step>("idle");
  const [fileName, setFileName] = React.useState("");
  const [rows, setRows] = React.useState<ImportRow[]>([]);
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const fileRef = React.useRef<File | null>(null);

  function handleFile(file: File) {
    fileRef.current = file;
    setParseError(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!raw.length) {
          setParseError("File kosong.");
          return;
        }

        // Validasi header
        const headers = (raw[0] as string[]).map((h) => String(h).trim());
        const missing = EXPECTED_HEADERS.filter((h) => !headers.includes(h));
        if (missing.length) {
          setParseError(
            `Kolom tidak sesuai template. Kolom hilang: ${missing.join(", ")}`,
          );
          return;
        }

        const idx = (name: string) => headers.indexOf(name);

        const parsed: ImportRow[] = [];
        for (let i = 1; i < raw.length; i++) {
          const r = raw[i] as unknown[];
          const kode = String(r[idx("Kode Barang")] ?? "").trim();
          if (!kode) continue; // skip baris kosong
          parsed.push({
            kode_barang: kode,
            nup: String(r[idx("NUP")] ?? "").trim(),
            nama_barang: String(r[idx("Nama Barang")] ?? "").trim(),
            merk: String(r[idx("Merk")] ?? "").trim() || null,
            status_bmn: String(r[idx("Status")] ?? "Aktif").trim(),
            kode_lokasi: String(r[idx("Kode Lokasi")] ?? "").trim() || null,
            nama_lokasi: String(r[idx("Nama Lokasi")] ?? "").trim() || null,
            kondisi: String(r[idx("Kondisi")] ?? "Baik").trim(),
            nip_pengguna: String(r[idx("NIP Pengguna")] ?? "").trim() || null,
            nama_pengguna: String(r[idx("Nama Pengguna")] ?? "").trim(),
          });
        }

        if (!parsed.length) {
          setParseError(
            "Tidak ada data di file. Pastikan baris data dimulai dari baris ke-2.",
          );
          return;
        }

        setRows(parsed);
        setStep("preview");
      } catch {
        setParseError(
          "Gagal membaca file. Pastikan format file adalah .xlsx atau .xls.",
        );
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  /*   async function handleImport() {
    setStep("importing");
    try {
      const res = await importBarangAction(rows);
      setResult(res);
      setStep("done");
    } catch {
      setParseError("Terjadi kesalahan saat import. Silakan coba lagi.");
      setStep("preview");
    }
  } */

  async function handleImport() {
    setStep("importing");
    try {
      // Kirim file langsung ke API Route, bukan Server Action
      const formData = new FormData();
      const file = fileRef.current!; // simpan File object saat parsing

      formData.append("file", file);

      const res = await fetch("/api/import-barang", {
        method: "POST",
        body: formData,
        // Jangan set Content-Type — browser otomatis set multipart boundary
      });

      if (!res.ok) {
        const data = await res.json();
        setParseError(data.error ?? "Terjadi kesalahan server.");
        setStep("preview");
        return;
      }

      const data = await res.json();
      setResult(data);
      setStep("done");
    } catch {
      setParseError(
        "Gagal terhubung ke server. Periksa koneksi internet Anda.",
      );
      setStep("preview");
    }
  }
  function handleReset() {
    setStep("idle");
    setRows([]);
    setResult(null);
    setParseError(null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Template download */}
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <IconFileSpreadsheet className="size-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Template Excel</p>
              <p className="text-xs text-muted-foreground">
                Download template lalu isi data barang sesuai format
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/template-bmn.xlsx" download>
              <IconDownload className="mr-2 size-4" />
              Download Template
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Step: idle — upload zone */}
      {step === "idle" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload File Excel</CardTitle>
            <CardDescription>
              Format yang didukung: .xlsx, .xls — maksimal 5MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            {parseError && (
              <Alert variant="destructive" className="mb-4">
                <IconAlertCircle className="size-4" />
                <AlertTitle>Format tidak valid</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 py-16 cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/30 transition-colors"
            >
              <IconUpload className="size-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  Drag & drop file di sini, atau klik untuk browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  .xlsx atau .xls
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: preview */}
      {step === "preview" && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Preview Data</CardTitle>
              <CardDescription>
                <span className="font-medium text-foreground">{fileName}</span>
                {" — "}
                <span className="font-semibold text-foreground">
                  {rows.length}
                </span>{" "}
                baris siap diimport
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <IconX className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border overflow-auto max-h-96">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0">
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>NUP</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Merk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>NIP Pengguna</TableHead>
                    <TableHead>Nama Pengguna</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 50).map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground text-xs">
                        {i + 2}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {row.kode_barang}
                      </TableCell>
                      <TableCell>{row.nup || "-"}</TableCell>
                      <TableCell className="font-medium">
                        {row.nama_barang}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.merk || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.status_bmn?.toLowerCase().includes("tidak")
                              ? "destructive"
                              : "default"
                          }
                        >
                          {row.status_bmn || "Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.nama_lokasi || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.kondisi || "Baik"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.nip_pengguna || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.nama_pengguna || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {rows.length > 50 && (
              <p className="text-xs text-muted-foreground text-center">
                Menampilkan 50 dari {rows.length} baris
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleReset}
              >
                Batal
              </Button>
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="w-full" onClick={handleImport}>
                Import {rows.length} Barang
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: importing */}
      {step === "importing" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <IconLoader2 className="size-10 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium">Sedang mengimport data...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Memproses {rows.length} barang, mohon tunggu
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: done */}
      {step === "done" && result && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Import</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-muted/30 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {result.success}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Berhasil</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {result.skipped}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Dilewati</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 text-center">
                <p className="text-2xl font-bold text-destructive">
                  {result.errors.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Error</p>
              </div>
            </div>

            {/* Success alert */}
            {result.success > 0 && (
              <Alert>
                <IconCircleCheckFilled className="size-4 text-green-500" />
                <AlertTitle>Import selesai</AlertTitle>
                <AlertDescription>
                  {result.success} barang berhasil disimpan ke database.
                </AlertDescription>
              </Alert>
            )}

            {/* Error detail */}
            {result.errors.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Baris yang gagal diimport:
                </p>
                <div className="rounded-lg border overflow-auto max-h-48">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Baris</TableHead>
                        <TableHead>Kode Barang</TableHead>
                        <TableHead>Alasan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.errors.map((err, i) => (
                        <TableRow key={i}>
                          <TableCell>{err.row}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {err.kode}
                          </TableCell>
                          <TableCell className="text-destructive text-sm">
                            {err.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="min-w-[120px]"
                onClick={handleReset}
              >
                Import Lagi
              </Button>
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="min-w-[120px]" asChild>
                <Link href="/barang">Lihat Data Barang</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
