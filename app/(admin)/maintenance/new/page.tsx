import MaintenanceForm from "@/components/maintenance/MaintenanceForm";
import { createMaintenance } from "@/lib/maintenance";
import { getBarang } from "@/lib/barang";
import { redirect } from "next/navigation";

export default async function NewMaintenancePage() {
  const barangs = (await getBarang()) || [];

  async function handleAction(fd: FormData) {
    "use server";
    const res = await createMaintenance(fd);
    if (res.success) {
      redirect("/maintenance");
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tambah Riwayat Maintenance
        </h1>
        <p className="text-gray-500 text-sm">
          Input detail pemeliharaan aset baru.
        </p>
      </div>
      <MaintenanceForm barangs={barangs} onSubmit={handleAction} />
    </div>
  );
}
