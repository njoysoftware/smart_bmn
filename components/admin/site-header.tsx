import { auth } from "@/auth";
import { Separator } from "@/components/ui/separator";
import { SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronsUpDown, LogOut, User2Icon } from "lucide-react";
import Link from "next/link";
import { BreadcrumbDynamic } from "@/components/breadcrumb-dynamic";
import { ModeToggle } from "@/components/mode-toggle"; // Import komponen baru

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <BreadcrumbDynamic />

        {/* Bagian Kanan Header */}
        <div className="ml-auto flex items-center gap-4">
          {/* Toggle Dark Mode */}
          <ModeToggle />

          {/* Dropdown User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="default"
                type="button"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border rounded-md"
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <User2Icon />
                </div>
                <ChevronDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              className="w-56 rounded-lg"
            >
              <DropdownMenuLabel>
                <div className="font-medium">
                  {session?.user?.name ?? "Guest"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {session?.user?.email ?? "-"}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/api/auth/signout"
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
