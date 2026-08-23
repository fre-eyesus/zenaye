"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup, type AuthState } from "@/app/actions/auth";

/**
 * Shared credentials form for both /login and /signup. Uses `useActionState`
 * so server-side validation errors render inline while the request is pending.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const action = isSignup ? signup : login;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    undefined,
  );

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-white">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {isSignup
          ? "Sign up to bookmark stories and personalize your feed."
          : "Log in to see your bookmarks and personalized feed."}
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        {isSignup && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-300">Name</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
            />
          </label>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-300">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-zinc-300">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={isSignup ? "At least 8 characters" : "••••••••"}
            className="rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
          />
        </label>

        {state?.error && (
          <p
            role="alert"
            className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? isSignup
              ? "Creating account…"
              : "Logging in…"
            : isSignup
              ? "Sign up"
              : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to Zenaye?{" "}
            <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
