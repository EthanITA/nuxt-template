import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
import type { Session, User } from "~~/server/database/schema/auth";

export const useAuth = defineStore("auth", () => {
  const client = createAuthClient({
    plugins: [adminClient()],
  });
  const session = ref<Session>();
  const user = ref<User>();
  const isAdmin = computed<boolean>(() => user.value?.role === "admin");
  const login = {
    email: client.signIn.email,
  };
  const register = {
    email: client.signUp.email,
  };

  const signOut = () => client.signOut().then(() => window.location.reload());

  const getSession = async () => {
    const { data, error } = await client.getSession();
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      session.value = data.session as Session;
      user.value = data.user as User;
    }
    return { data, error };
  };

  return {
    user,
    session,
    isAdmin,
    login,
    register,
    signOut,
    getSession,
  };
});
