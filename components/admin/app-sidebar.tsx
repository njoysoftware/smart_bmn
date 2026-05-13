"use client";

import * as React from "react";
import {
  Bot,
  SquareTerminal,
  PrinterCheckIcon,
  UserCheck2Icon,
} from "lucide-react";

import { NavMain } from "@/components/admin/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
// This is sample data.
const data = {
  navMain: [
    {
      title: "Barang",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Data Barang",
          url: "/barang",
        },
        {
          title: "Import data",
          url: "/barang/import",
        },
      ],
    },
    {
      title: "Maintenance dan Usulan",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Data Maintenance",
          url: "/maintenance",
        },
        {
          title: "Data Usulan",
          url: "/usulan",
        },
      ],
    },
    {
      title: "Instansi",
      url: "#",
      icon: UserCheck2Icon,
      isActive: true,
      items: [
        {
          title: "Data pegawai",
          url: "/pegawai",
        },
        {
          title: "Instansi",
          url: "/instansi",
        },
      ],
    },
    {
      title: "Laporan",
      url: "#",
      isActive: true,
      icon: PrinterCheckIcon,
      items: [
        {
          title: "Cetak Laporan",
          url: "/laporan",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/dashboard">
          <div className="flex items-center space-x-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <img
                src="/icon.png"
                alt="Logo Smart BMN"
                className="size-xs object-contain"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold">Smart BMN</span>
              <span className="truncate text-xs">penjaga Aset Negeri</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
