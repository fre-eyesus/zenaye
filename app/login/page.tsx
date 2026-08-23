import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Log in — Zenaye" };

export default async function LoginPage() {
  // Already signed in? Skip the form.
  const session = await auth();
  if (session?.user) redirect("/");

  return <AuthForm mode="login" />;
}
