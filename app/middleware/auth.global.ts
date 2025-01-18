export default defineNuxtRouteMiddleware(async (to) => {
  /* TODO uncomment this block

  const auth = useAuth();
  const { enabled: authRequired = "default", roles: requiredRoles = [] } =
    to.meta?.auth ?? {};

  const isAuthPage = ["/login", "/register"];
  if (isAuthPage.includes(to.path)) {
    await auth.getSession();
    if (auth.session?.id) return navigateTo("/");
    return;
  }

  const isSessionValid =
    auth.session?.id && auth.session.expiresAt.getTime() > Date.now();

  if (authRequired === "force" || !isSessionValid) {
    await auth.getSession();
    if (!auth.session?.id) return navigateTo("/login");
  }

  const hasRequiredRole =
    requiredRoles.length === 0 ||
    requiredRoles.includes(auth.user?.role ?? "user");
  if (!hasRequiredRole) {
    return navigateTo("/");
  }
*/
});
