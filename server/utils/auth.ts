import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./drizzle";
import { admin } from "better-auth/plugins";
import { H3Event } from "h3";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
});

export const getAuthSession = (event: H3Event, force = false) =>
  auth.api.getSession({
    headers: event.headers,
    query: { disableCookieCache: force },
  });

export const isAdmin = async (event: H3Event) => {
  const authSession = await getAuthSession(event);
  return authSession?.user?.role === "admin";
};

export type AuthSession = Awaited<ReturnType<typeof getAuthSession>>;
