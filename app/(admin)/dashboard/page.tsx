import { SectionCards } from "@/components/admin/section-cards";
import { getDashboardStats } from "@/lib/dashboard";
import { getInstansi } from "@/lib/instansi";

export default async function DashboardPage() {
  // Fetch data di server
  const stats = await getDashboardStats();
  const instansi = await getInstansi();

  return (
    <div className="py-6 space-y-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          {instansi?.nama_instansi.toString() ?? null}
        </h1>
        <p className="text-muted-foreground">
          Ringkasan kondisi aset BMN saat ini.
        </p>
      </div>

      {/* Mengirim hasil query ke komponen UI */}
      <SectionCards stats={stats} />

      {/* Komponen lain seperti Chart atau Table bisa diletakkan di bawahnya */}
    </div>
  );
}
