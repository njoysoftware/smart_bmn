import { getBarangById, updateBarang } from "@/lib/barang";
import EditBarangForm from "@/components/barang/edit-barang-form";
import { notFound } from "next/navigation";

interface EditBarangPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBarangPage({ params }: EditBarangPageProps) {
  const { id } = await params;
  const barang = await getBarangById(id);

  if (!barang) notFound();

  const updateBarangById = updateBarang.bind(null, id);

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Barang</h1>
      <EditBarangForm action={updateBarangById} barang={barang} />
    </div>
  );
}
