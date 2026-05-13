import { getInstansi } from "@/lib/instansi";
import InstansiForm from "@/components/instansi/InstansiForm";

export default async function InstansiPage() {
  const data = await getInstansi();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Profil Instansi</h1>
      </div>

      {/* Panggil Client Component di sini */}
      <InstansiForm initialData={data} />
    </div>
  );
}
