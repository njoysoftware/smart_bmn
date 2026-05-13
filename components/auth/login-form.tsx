"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormState, loginAction } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = React.useActionState(loginAction, {
    message: null,
  } as FormState);

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message, { id: "login-error" }); // id mencegah toast duplikat
    }
    if (state?.success) {
      toast.success("Login berhasil! Mengalihkan...");
    }
  }, [state?.message, state?.success, state?.timestamp]); // Tambahkan timestamp untuk memastikan efek berjalan setiap kali state berubah

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="space-y-4 flex flex-col items-center justify-center pb-8">
          {/* Container Logo - Diposisikan Senter */}
          <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
            <Image
              src="/icon.png"
              alt="Logo Smart BMN"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>

          {/* Judul dan Deskripsi - Teks Senter */}
          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              Smart BMN
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-500 max-w-[250px] mx-auto leading-relaxed">
              Selamat datang kembali, silakan masuk ke akun Anda untuk mengelola
              aset.
            </CardDescription>
          </div>

          {/* Separator Halus (Opsional) */}
          <div className="w-12 h-1 bg-blue-600 rounded-full mt-2" />
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
                {/* Error validasi Zod (Contoh: format email salah) */}
                {state?.error?.email && (
                  <p className="text-xs text-red-500 font-medium">
                    {state.error.email[0]}
                  </p>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="text-xs underline underline-offset-4">
                    Lupa password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" required />
                {/* Error validasi Zod (Contoh: password kurang panjang) */}
                {state?.error?.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {state.error.password[0]}
                  </p>
                )}
              </Field>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Memproses..." : "Login"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <a href="/register" className="underline">
                  Daftar
                </a>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="px-6 text-center text-xs text-muted-foreground">
        Dengan mengklik lanjut, anda menyetujui <a href="#">Syarat Layanan</a>{" "}
        dan <a href="#">Kebijakan Privasi</a> kami.
      </p>
    </div>
  );
}
