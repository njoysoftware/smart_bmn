import MaintenanceForm from "@/components/maintenance/MaintenanceForm";
import { getBarang } from "@/lib/barang";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function EditMaintenancePage({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id;

  const [maintenance, barangs] = await Promise.all([
    prisma.maintenance.findUnique({
      where: { id: BigInt(id) },
    }),
    getBarang(),
  ]);

  if (!maintenance) redirect("/maintenance");

  // Normalisasi data untuk defaultValues React Hook Form
  const initialData = {
    ...maintenance,
    barang_id: maintenance.barang_id.toString(),
    tanggal: maintenance.tanggal.toISOString().split("T")[0],
    biaya: maintenance.biaya?.toString() || "",
    // Kembalikan underscore ke spasi untuk tampilan UI select
    kondisi_setelah: maintenance.kondisi_setelah.replace("_", " "),
  };

  async function handleUpdate(fd: FormData) {
    "use server";
    // Logika update sederhana langsung menggunakan prisma di sini
    // (Atau buat fungsi updateMaintenance di lib/maintenance.ts)
    redirect("/maintenance");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Riwayat Maintenance
        </h1>
        <p className="text-gray-500 text-sm">
          Perbarui informasi pemeliharaan aset.
        </p>
      </div>
      <MaintenanceForm
        barangs={barangs || []}
        initialData={initialData}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
