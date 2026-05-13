"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function ExportButton({
  start,
  end,
  type,
}: {
  start: string;
  end: string;
  type: string;
}) {
  const handleDownload = () => {
    // Membuka window baru akan memicu download otomatis dari API Route
    window.open(
      `/api/export/docx?type=${type}&start=${start}&end=${end}`,
      "_blank",
    );
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      <FileDown className="mr-2 h-4 w-4" />
      Cetak DOCX
    </Button>
  );
}
