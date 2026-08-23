"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** State returned to the form via `useActionState`. */
export type AuthState = { error: string } | undefined;

/**
 * Log in with email + password. On success `signIn` throws a redirect (to `/`)
 * which must propagate; invalid credentials surface as an inline error.
 */
export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/",
    });
    return undefined;
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    // Re-throw everything else, including the NEXT_REDIRECT control-flow signal.
    throw error;
  }
}

/**
 * Create an account, then sign the new user in. Validation and the duplicate
 * check return inline errors; the final `signIn` throws the success redirect.
 */
export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "An account with that email already exists." };
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, name: name || null, passwordHash },
    });
  } catch {
    return { error: "Something went wrong creating your account. Try again." };
  }

  // Outside the try/catch: signIn throws the NEXT_REDIRECT that logs the user
  // in and sends them to the home feed.
  await signIn("credentials", { email, password, redirectTo: "/" });
  return undefined;
}
