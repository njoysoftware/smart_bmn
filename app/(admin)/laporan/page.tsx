"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileDown, Calendar as CalendarIcon, Printer } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function LaporanPage() {
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-01"),
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [reportType, setReportType] = useState<string>("barang");
  const [loading, setLoading] = useState(false);

  // Fungsi helper untuk menghindari pergeseran tanggal akibat timezone
  const safeDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const generatePDF = async () => {
    // 1. Validasi Input Tanggal
    if (!startDate || !endDate) {
      toast.error("Silahkan pilih periode tanggal terlebih dahulu");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Tanggal akhir tidak boleh lebih kecil dari tanggal mulai");
      return;
    }

    setLoading(true);
    const toastId = toast.loading(`Sedang menyiapkan laporan ${reportType}...`);

    try {
      const res = await fetch(
        `/api/laporan/data?type=${reportType}&start=${startDate}&end=${endDate}`,
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengambil data");
      }

      const data = await res.json();

      if (data.length === 0) {
        toast.error("Tidak ada data ditemukan untuk periode ini", {
          id: toastId,
        });
        setLoading(false);
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // --- KOP SURAT ---
      doc.setFont("helvetica", "bold").setFontSize(18);
      doc.text("BADAN PENGAWAS PEMILIHAN UMUM", 148, 15, { align: "center" });
      doc
        .setFontSize(16)
        .text("KABUPATEN LAMONGAN", 148, 22, { align: "center" });
      doc.setFont("helvetica", "normal").setFontSize(10);
      doc.text(
        "Jl. Raya Mastrip No.44 Lamongan | Email: set.lamongan@bawaslu.go.id",
        148,
        28,
        { align: "center" },
      );
      doc.setLineWidth(0.5).line(15, 32, 282, 32);

      // --- JUDUL ---
      doc.setFont("helvetica", "bold").setFontSize(14);
      doc.text(`LAPORAN DATA ${reportType.toUpperCase()}`, 148, 45, {
        align: "center",
      });
      doc.setFontSize(10).setFont("helvetica", "normal");
      doc.text(
        `Periode: ${format(safeDate(startDate), "dd/MM/yyyy")} s/d ${format(safeDate(endDate), "dd/MM/yyyy")}`,
        148,
        51,
        { align: "center" },
      );

      // --- PERSIAPAN TABEL ---
      const tableColumn =
        reportType === "barang"
          ? ["No", "Kode Barang", "NUP", "Nama Barang", "Kondisi", "Status"]
          : ["No", "Nama Barang", "Tanggal", "Jenis", "Biaya"];

      const tableRows = data.map((item: any, index: number) => {
        if (reportType === "barang") {
          return [
            index + 1,
            item.kode_barang,
            item.nup,
            item.nama_barang,
            item.kondisi,
            item.status_bmn,
          ];
        } else {
          return [
            index + 1,
            item.barang?.nama_barang || "-",
            format(new Date(item.tanggal), "dd/MM/yyyy"),
            item.jenis,
            `Rp ${Number(item.biaya).toLocaleString("id-ID")}`,
          ];
        }
      });

      // 2. Tambahkan Ringkasan Total Khusus Maintenance
      if (reportType === "maintenance") {
        const totalBiaya = data.reduce(
          (sum: number, item: any) => sum + Number(item.biaya),
          0,
        );
        tableRows.push([
          {
            content: "TOTAL KESELURUHAN PENGELUARAN",
            colSpan: 4,
            styles: {
              halign: "right",
              fontStyle: "bold",
              fillColor: [240, 240, 240],
            },
          },
          {
            content: `Rp ${totalBiaya.toLocaleString("id-ID")}`,
            styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
          },
        ]);
      }

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        headStyles: { fillColor: [37, 99, 235], halign: "center" },
        styles: { font: "helvetica", fontSize: 9 },
      });

      // --- TANDA TANGAN ---
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc
        .setFont("helvetica", "normal")
        .text(
          `Lamongan, ${format(new Date(), "dd MMMM yyyy", { locale: id })}`,
          220,
          finalY,
        );
      doc.text("Kuasa Pengguna Barang,", 220, finalY + 7);
      doc
        .setFont("helvetica", "bold")
        .text("Agus Prijambodo, S.H.", 220, finalY + 30);

      doc.save(`Laporan_${reportType}_${format(new Date(), "yyyyMMdd")}.pdf`);
      toast.success("Dokumen berhasil diunduh", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Pusat Laporan
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Cetak dokumen laporan BMN dalam format PDF resmi Bawaslu Lamongan
          </p>
        </div>

        <Card className="shadow-2xl border-slate-200 overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50/80 border-b p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                <Printer className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Filter Laporan
                </CardTitle>
                <CardDescription className="font-medium">
                  Tentukan periode dan jenis data untuk ekspor PDF
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Jenis Data
                </Label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full h-12 border-2 border-slate-100 rounded-xl px-4 focus:border-blue-500 outline-none transition-all bg-white font-bold text-slate-700"
                >
                  <option value="barang">Laporan Data Barang (BMN)</option>
                  <option value="maintenance">
                    Laporan Riwayat Maintenance
                  </option>
                  <option value="usulan">Laporan Usulan (RKBMN)</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Periode Laporan
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 border-2 border-slate-100 rounded-xl px-3 text-sm font-bold focus:border-blue-500 outline-none"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 border-2 border-slate-100 rounded-xl px-3 text-sm font-bold focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 border-2 border-blue-100/50 p-6 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-black text-blue-900 uppercase tracking-tight">
                  Ringkasan Ekspor
                </p>
                <p className="text-blue-700 font-medium leading-relaxed">
                  Mencetak laporan{" "}
                  <span className="font-bold underline">{reportType}</span> dari{" "}
                  {startDate
                    ? format(safeDate(startDate), "dd MMMM yyyy", {
                        locale: id,
                      })
                    : "-"}{" "}
                  sampai{" "}
                  {endDate
                    ? format(safeDate(endDate), "dd MMMM yyyy", { locale: id })
                    : "-"}
                  .
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={generatePDF}
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xl font-black shadow-xl shadow-blue-200 transition-all active:scale-[0.97] flex gap-3"
              >
                {loading ? (
                  "Sedang Memproses..."
                ) : (
                  <>
                    <FileDown className="h-7 w-7" />
                    Download PDF Resmi
                  </>
                )}
              </Button>
              <p className="text-center text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest">
                * Sesuai Standar Pelaporan BMN Bawaslu Kabupaten Lamongan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
