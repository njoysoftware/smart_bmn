import UsulanForm from "@/components/usulan/UsulanForm";
import { createUsulan } from "@/lib/usulan";
import { getBarang } from "@/lib/barang";
import { redirect } from "next/navigation";

export default async function NewUsulanPage() {
  const barangs = (await getBarang()) || [];
  async function action(fd: FormData) {
    "use server";
    const res = await createUsulan(fd);
    if (res.success) redirect("/usulan");
  }
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Tambah Usulan
          </h1>
        </div>
        <UsulanForm barangs={barangs} onSubmit={action} />
      </div>
    </div>
  );
}
