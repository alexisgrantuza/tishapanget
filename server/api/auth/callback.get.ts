import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = process.env.SUPABASE_KEY as string;

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Supabase configuration missing",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const query = getQuery(event);

  if (query.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      query.code as string
    );

    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message,
      });
    }

    if (data.user) {
      await $fetch("/api/auth/create-user", {
        method: "POST",
        body: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.email?.split("@")[0] || "",
          firstName: data.user.user_metadata?.full_name?.split(" ")[0] || "",
          lastName: data.user.user_metadata?.full_name?.split(" ")[1] || "",
        },
      });
    }
  }

  return sendRedirect(event, "/workspace");
});
