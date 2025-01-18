export default defineEventHandler(async (event) => {
  const isApi = event.path.startsWith("/api");
  const isAuth = event.path.startsWith("/api/auth");

  if (isApi && !isAuth) {
    const token = event.headers
      .get("cookie")
      ?.split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("better-auth.session_token"))
      ?.split("=")[1];

    if (!token) {
      setResponseStatus(event, 401);
      return { message: "Unauthorized" };
    }
  }
});
