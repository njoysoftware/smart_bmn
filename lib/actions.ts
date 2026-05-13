"use server";
import { LoginSchema, RegisterSchema } from "@/lib/zod";
import {hashSync} from "bcrypt-ts";
import { revalidatePath } from "next/cache";   
import { prisma } from "@/prisma";
import {signIn} from "@/auth";
import { AuthError } from "next-auth";
import { refine } from "zod";
import { dmmf } from "@prisma/client/scripts/default-index.js";

export const signupAction = async (prevState: any, data: FormData) => {
  const result = RegisterSchema.safeParse(
    Object.fromEntries(data.entries())
    );

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors
    };
  }
const { name: validatedName, email: validatedEmail, password: validatedPassword } = result.data;
const hashedPassword = hashSync(validatedPassword, 10);
try {
    await prisma.user.create({
      data: {
        name: validatedName,
        email: validatedEmail,
        password: hashedPassword
      }
    });
} catch (error) {
    return {
      error: {
        email: ["Email sudah terdaftar"],
        password: ["Password harus lebih dari 6 karakter"],
        confirmPassword: ["Password confirmation harus sama dengan password"]
      }
    };
}
revalidatePath("/(auth)/register");
//redirect("/(auth)/login");
}   

//Login
// Definisikan tipe untuk state
export type FormState = {
  error?: {
    email?: string[];
    password?: string[];
    role?: string[];
  }| null;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  message?: string | null;
  success?: boolean;
  timestamp?: Date | number;
};

export const loginAction = async (prevState: FormState, data: FormData): Promise<FormState> => {
const result = LoginSchema.safeParse(
    Object.fromEntries(data.entries())
    );

  if (!result.success) {
    return {
      error: result.error.flatten().fieldErrors,
      message: null,
      success: false,
      timestamp: Date.now()
    };
  }
  const { email: validatedEmail, password: validatedPassword} = result.data;
  try {
      await signIn("credentials", {
      email: validatedEmail,
      password: validatedPassword,  
      redirectTo:'/dashboard',

    });
    return { message: null, success: true, timestamp: Date.now() }; // Berhasil
  } catch (error) {
      if (error instanceof AuthError) {
        if (error.type === "CredentialsSignin" || error.type === "CallbackRouteError") {
            return {
              error: null,
              message: "Email atau password salah",
              success: false,
              timestamp: Date.now()
              };
        } return {
        error: null,
        message: "Terjadi kesalahan sistem. Silakan coba lagi.",
        success: false,
        timestamp: Date.now(),
      };
      }
      throw error;
    };
}

