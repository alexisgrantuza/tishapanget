export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const signUp = async (
    email: string,
    password: string,
    userData: {
      username: string;
      firstName: string;
      lastName: string;
    }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });

      if (error) throw error;

      // Create user in our database
      if (data.user) {
        await $fetch("/api/auth/create-user", {
          method: "POST",
          body: {
            id: data.user.id,
            email: data.user.email,
            ...userData,
          },
        });
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Ensure user exists in our database (in case they signed up via OAuth first)
      if (data.user) {
        await ensureUserInDatabase(data.user);
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const signInWithProvider = async (provider: "google" | "apple") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/confirm`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await navigateTo("/login");
    } catch (error: any) {
      console.error("Sign out error:", error);
    }
  };

  // Helper function to ensure user exists in database
  const ensureUserInDatabase = async (supabaseUser: any) => {
    try {
      await $fetch("/api/auth/sync-user", {
        method: "POST",
        body: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          user_metadata: supabaseUser.user_metadata,
        },
      });
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  };

  return {
    user: readonly(user),
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    ensureUserInDatabase,
  };
};
