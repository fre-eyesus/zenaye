import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Sign up — Zenaye" };

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return <AuthForm mode="signup" />;
}
