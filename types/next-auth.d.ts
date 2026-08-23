import type { DefaultSession } from "next-auth";

// Expose the user's database id on the session so Server Components, Route
// Handlers, and Server Actions can scope queries to the logged-in user.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
