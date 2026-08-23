// Auth.js route handlers — exposes /api/auth/* endpoints (session, csrf,
// callback, signin, signout) consumed by the client SessionProvider and the
// server-side signIn/signOut helpers.
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
