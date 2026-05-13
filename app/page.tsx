import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  IconBox,
  IconShieldCheck,
  IconChartBar,
  IconTool,
  IconChevronRight,
  IconArrowRight,
} from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* --- NAVBAR --- */}
      <header className="px-4 lg:px-10 h-20 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src="/icon.png" alt="Logo" width={32} height={32} />
          <span className="text-xl font-black tracking-tighter uppercase">
            Smart BMN
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button
              size="xs"
              className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-200"
            >
              Login <IconArrowRight className="ml-2" />
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="w-full py-20 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Sistem Informasi Inventaris Modern
                </div>
                <h1 className="text-5xl font-black tracking-tighter sm:text-6xl xl:text-7xl/none text-slate-900">
                  Penjaga Digital{" "}
                  <span className="text-blue-600">Aset Negeri.</span>
                </h1>
                <p className="max-w-[600px] text-slate-500 md:text-xl font-medium leading-relaxed">
                  Kelola, monitor, dan laporkan Barang Milik Negara (BMN) dengan
                  akurasi tinggi dan efisiensi maksimal dalam satu platform
                  terpadu.
                </p>
                {/*                 <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-200"
                    >
                      Login <IconArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div> */}
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
                <div className="relative bg-white border rounded-2xl shadow-2xl p-4 overflow-hidden group">
                  <Image
                    src="/dashboard-preview.png" // Ganti dengan screenshot dashboard Anda
                    alt="Dashboard Preview"
                    width={800}
                    height={500}
                    className="rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-black tracking-tighter sm:text-4xl uppercase">
                Fitur Unggulan
              </h2>
              <p className="text-slate-500 max-w-[700px] mx-auto font-medium">
                Didesain khusus untuk memenuhi kebutuhan pengelolaan aset
                instansi pemerintah yang kompleks namun tetap intuitif.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<IconBox className="text-blue-600" size={32} />}
                title="Manajemen Inventaris"
                description="Pendataan barang lengkap dengan NUP, Kode Register, dan kategori yang terstruktur."
              />
              <FeatureCard
                icon={<IconTool className="text-purple-600" size={32} />}
                title="Riwayat Maintenance"
                description="Pantau siklus hidup aset mulai dari perbaikan hingga biaya pemeliharaan secara real-time."
              />
              <FeatureCard
                icon={<IconChartBar className="text-emerald-600" size={32} />}
                title="Pelaporan Cepat"
                description="Ekspor data ke format PDF atau Excel siap saji untuk kebutuhan audit dan RKBMN."
              />
            </div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className="w-full py-20 bg-blue-600 text-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <h3 className="text-4xl font-black">100%</h3>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">
                  Aman & Terenkripsi
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black">Real-Time</h3>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">
                  Sinkronisasi Data
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black">Efisiensi</h3>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">
                  Waktu Kerja
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black">Cloud</h3>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">
                  Akses Di Mana Saja
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t py-12 bg-slate-50">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Logo" width={24} height={24} />
            <span className="font-black uppercase tracking-tight">
              Smart BMN
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            © 2026 Smart BMN. Hak Cipta Dilindungi - Kabupaten Lamongan.
          </p>
          <div className="flex gap-6">
            <Link
              className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors"
              href="#"
            >
              Kebijakan Privasi
            </Link>
            <Link
              className="text-sm text-slate-500 hover:text-blue-600 font-bold transition-colors"
              href="https://wa.me/6285648584854"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB KOMPONEN ---
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      <div className="mb-6 p-3 bg-slate-50 inline-block rounded-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
