"use client";

import { SessionProvider } from "next-auth/react";

// Client boundary so `useSession()` works in the Header's UserNav. Wraps the
// whole app in layout.tsx.
export function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
