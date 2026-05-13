import PegawaiForm from "@/components/pegawai/PegawaiForm";

export default function NewPegawaiPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tambah Pegawai Baru
        </h1>
        <p className="text-gray-500">
          Isi identitas pegawai untuk penugasan aset.
        </p>
      </div>
      <PegawaiForm />
    </div>
  );
}
