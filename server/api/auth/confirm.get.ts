import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseServiceKey = config.supabaseServiceKey;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Supabase configuration missing",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const query = getQuery(event);

  if (query.code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        query.code as string
      );

      if (error) {
        console.error("Auth error:", error);
        throw createError({
          statusCode: 400,
          statusMessage: error.message,
        });
      }

      if (data.user) {
        // Sync user to database
        await $fetch("/api/auth/sync-user", {
          method: "POST",
          body: {
            id: data.user.id,
            email: data.user.email,
            user_metadata: data.user.user_metadata,
            app_metadata: data.user.app_metadata,
          },
        });
      }

      return sendRedirect(event, "/workspace");
    } catch (error: any) {
      console.error("Callback error:", error);
      return sendRedirect(event, "/login?error=callback_failed");
    }
  }

  return sendRedirect(event, "/login?error=no_code");
});
