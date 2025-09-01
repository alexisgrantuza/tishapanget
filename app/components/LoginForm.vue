<script setup lang="ts">
import { Button } from "@/components/ui/button/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/index";
import { Input } from "@/components/ui/input/index";
import { Label } from "@/components/ui/label/index";
import { toast } from "vue-sonner";

const { signIn, signInWithProvider } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;

  const { data, error } = await signIn(form.email, form.password);

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Success",
      description: "Logged in successfully!",
    });
    await navigateTo("/workspace");
  }

  loading.value = false;
};

const handleProviderLogin = async (provider: "google" | "apple") => {
  const { error } = await signInWithProvider(provider);

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 w-96">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Login with your Apple or Google account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-6">
            <div class="flex flex-col gap-4">
              <Button
                type="button"
                variant="outline"
                class="w-full"
                @click="handleProviderLogin('apple')"
                :disabled="loading"
              >
                <!-- Apple SVG -->
                Login with Apple
              </Button>
              <Button
                type="button"
                variant="outline"
                class="w-full"
                @click="handleProviderLogin('google')"
                :disabled="loading"
              >
                <!-- Google SVG -->
                Login with Google
              </Button>
            </div>

            <div
              class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
            >
              <span
                class="relative z-10 bg-background px-2 text-muted-foreground"
              >
                Or continue with
              </span>
            </div>

            <div class="grid gap-6">
              <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div class="grid gap-2">
                <div class="flex items-center">
                  <Label for="password">Password</Label>
                  <NuxtLink
                    to="/forgot-password"
                    class="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </NuxtLink>
                </div>
                <Input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" class="w-full" :disabled="loading">
                {{ loading ? "Signing in..." : "Login" }}
              </Button>
            </div>
            <div class="text-center text-sm">
              Don't have an account?
              <NuxtLink to="/signup" class="underline underline-offset-4">
                Sign up
              </NuxtLink>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
