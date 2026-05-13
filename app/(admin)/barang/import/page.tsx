// app/barang/import/page.tsx
import ImportBarangClient from "@/components/barang/import-barang-client";

export default function ImportBarangPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Import Barang</h1>
        <p className="text-muted-foreground mt-1">
          Upload file Excel sesuai template untuk import data barang ke
          database.
        </p>
      </div>
      <ImportBarangClient />
    </div>
  );
}
