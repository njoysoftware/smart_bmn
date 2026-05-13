-- CreateEnum
CREATE TYPE "StatusBMN" AS ENUM ('Aktif', 'Tidak Aktif');

-- CreateEnum
CREATE TYPE "Kondisi" AS ENUM ('Baik', 'Rusak Ringan', 'Rusak Berat', 'Dihapus');

-- CreateEnum
CREATE TYPE "JenisRekomendasi" AS ENUM ('Pengadaan', 'Penggantian', 'Penghapusan');

-- CreateEnum
CREATE TYPE "Prioritas" AS ENUM ('Tinggi', 'Sedang', 'Rendah');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "instansis" (
    "id" BIGSERIAL NOT NULL,
    "nama_instansi" TEXT NOT NULL,
    "alamat" TEXT,
    "telepon" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "instansis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lokasis" (
    "id" BIGSERIAL NOT NULL,
    "kode_ruang" TEXT,
    "nama_ruang" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "lokasis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pegawais" (
    "id" BIGSERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pegawais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barangs" (
    "id" BIGSERIAL NOT NULL,
    "kode_barang" TEXT NOT NULL,
    "nup" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "merk" TEXT,
    "kode_register" TEXT,
    "status_bmn" "StatusBMN" NOT NULL DEFAULT 'Aktif',
    "lokasi_id" BIGINT,
    "pegawai_id" BIGINT,
    "kondisi" "Kondisi" NOT NULL DEFAULT 'Baik',
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "barangs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "id" BIGSERIAL NOT NULL,
    "barang_id" BIGINT NOT NULL,
    "tanggal" DATE NOT NULL,
    "jenis" TEXT NOT NULL,
    "deskripsi" TEXT,
    "biaya" INTEGER,
    "kondisi_setelah" "Kondisi" NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usulans" (
    "id" BIGSERIAL NOT NULL,
    "barang_id" BIGINT NOT NULL,
    "jenis_rekomendasi" "JenisRekomendasi" NOT NULL,
    "alasan" TEXT NOT NULL,
    "prioritas" "Prioritas" NOT NULL,
    "tahun" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "usulans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "lokasis_nama_ruang_key" ON "lokasis"("nama_ruang");

-- CreateIndex
CREATE UNIQUE INDEX "barangs_kode_barang_nup_key" ON "barangs"("kode_barang", "nup");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barangs" ADD CONSTRAINT "barangs_lokasi_id_fkey" FOREIGN KEY ("lokasi_id") REFERENCES "lokasis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barangs" ADD CONSTRAINT "barangs_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "pegawais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usulans" ADD CONSTRAINT "usulans_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
