import { getLokasis, deleteLokasi } from "@/lib/lokasi";
import Link from "next/link";

export default async function LokasiPage() {
  const data = await getLokasis();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Lokasi</h1>
        <Link
          href="/lokasi/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Baru
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Kode Ruang</th>
              <th className="p-4 font-semibold">Nama Ruang</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="p-4">{l.kode_ruang || "-"}</td>
                <td className="p-4 font-medium">{l.nama_ruang}</td>
                <td className="p-4 flex justify-center gap-3">
                  <Link
                    href={`/lokasi/${l.id}/edit`}
                    className="text-amber-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteLokasi(l.id);
                    }}
                  >
                    <button className="text-red-600 hover:underline">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
