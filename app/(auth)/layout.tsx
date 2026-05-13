import React from "react";
import { SquareTerminal } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const Authlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Toaster richColors closeButton position="top-center" />
        {children}
      </div>
    </div>
  );
};

export default Authlayout;
