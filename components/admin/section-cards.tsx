"use client";

import {
  IconBox,
  IconCheck,
  IconAlertTriangle,
  IconTool,
  IconActivity,
  IconCircleX,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardStats {
  totalBarang: number;
  baik: number;
  rusakRingan: number;
  rusakBerat: number;
  aktif: number;
  tidakAktif: number;
  totalMaintenance: number;
}

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="space-y-6 px-4 lg:px-6 py-6">
      {/* Baris Utama: Total Barang (Full Width atau Highlighted) */}
      <div className="grid grid-cols-1 gap-4">
        <Card
          data-slot="card"
          className="border-l-4 border-l-primary shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardDescription className="font-medium uppercase tracking-wider text-xs">
                Inventaris Global
              </CardDescription>
              <CardTitle className="text-4xl font-bold tabular-nums text-primary">
                {stats.totalBarang.toLocaleString("id-ID")}
              </CardTitle>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <IconBox size={28} className="text-primary" />
            </div>
          </CardHeader>
          <div className="px-6 pb-4">
            <Badge variant="secondary" className="font-semibold">
              Sistem Asset BMN
            </Badge>
          </div>
        </Card>
      </div>

      {/* Baris Kedua: Status Operasional & Kondisi */}
      <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 w-full">
          {/* Aktif */}
          <Card className="hover:shadow-md transition-shadow border-none">
            <CardHeader className="p-4">
              <CardDescription className="text-xs font-semibold text-emerald-600">
                STATUS AKTIF
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-700">
                {stats.aktif}
              </CardTitle>
              <CardAction className="mt-2">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none gap-1">
                  <IconActivity size={12} /> Online
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>

          {/* Tidak Aktif */}
          <Card className="hover:shadow-md transition-shadow border-none">
            <CardHeader className="p-4">
              <CardDescription className="text-xs font-semibold text-rose-500">
                NON-AKTIF
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-rose-700">
                {stats.tidakAktif}
              </CardTitle>
              <CardAction className="mt-2">
                <Badge className="bg-rose-200 text-rose-700 hover:bg-slate-200 border-none gap-1">
                  <IconCircleX size={12} /> Offline
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Kondisi Baik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 w-full">
        <Card className="hover:shadow-md transition-shadow border-none">
          <CardHeader className="p-4">
            <CardDescription className="text-xs font-semibold text-blue-600">
              KONDISI BAIK
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700">
              {stats.baik}
            </CardTitle>
            <CardAction className="mt-2">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none gap-1">
                <IconCheck size={12} /> Terawat
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Rusak Ringan */}
        <Card className="hover:shadow-md transition-shadow border-none">
          <CardHeader className="p-4">
            <CardDescription className="text-xs font-semibold text-amber-600">
              RUSAK RINGAN
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-700">
              {stats.rusakRingan}
            </CardTitle>
            <CardAction className="mt-2">
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none gap-1">
                <IconAlertTriangle size={12} /> Perlu Cek
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>

        {/* Rusak Berat */}
        <Card className="hover:shadow-md transition-shadow border-none">
          <CardHeader className="p-4">
            <CardDescription className="text-xs font-semibold text-red-600">
              RUSAK BERAT
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-red-700">
              {stats.rusakBerat}
            </CardTitle>
            <CardAction className="mt-2">
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none gap-1">
                <IconAlertTriangle size={12} /> Perbaikan
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 w-full">
        {/* Maintenance */}
        <Card className="hover:shadow-md transition-shadow border-none">
          <CardHeader className="p-4">
            <CardDescription className="text-xs font-semibold text-purple-600">
              MAINTENANCE
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-purple-700">
              {stats.totalMaintenance}
            </CardTitle>
            <CardAction className="mt-2">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none gap-1">
                <IconTool size={12} /> Logs
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
