export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      // Ensure user is synced to our database
      try {
        await $fetch("/api/auth/sync-user", {
          method: "POST",
          body: {
            id: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
            app_metadata: session.user.app_metadata,
          },
        });
      } catch (error) {
        console.error("Failed to sync user on auth state change:", error);
      }
    }
  });
});
