import UsulanForm from "@/components/usulan/UsulanForm";
import { getBarang } from "@/lib/barang";
import { updateUsulan } from "@/lib/usulan";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export default async function EditUsulanPage({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id;
  const [usulan, barangs] = await Promise.all([
    prisma.usulan.findUnique({ where: { id: BigInt(id) } }),
    getBarang(),
  ]);

  if (!usulan) redirect("/usulan");

  const initialData = {
    ...usulan,
    barang_id: usulan.barang_id.toString(),
  };

  async function action(fd: FormData) {
    "use server";
    const res = await updateUsulan(id, fd);
    if (res.success) redirect("/usulan");
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Edit Usulan
          </h1>
        </div>
        <UsulanForm
          barangs={barangs || []}
          initialData={initialData}
          onSubmit={action}
        />
      </div>
    </div>
  );
}
