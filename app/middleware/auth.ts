export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Protected routes
  const protectedRoutes = ["/dashboard", "/boards", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    to.path.startsWith(route)
  );

  // Auth routes
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(to.path);

  // Redirect logic
  if (isProtectedRoute && !user.value) {
    return navigateTo("/login");
  }

  if (isAuthRoute && user.value) {
    return navigateTo("/dashboard");
  }
});
