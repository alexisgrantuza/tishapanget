<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div
        class="container mx-auto flex h-16 items-center justify-between px-4"
      >
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg cursor-pointer"
              >
                <svg
                  class="h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v18h-8V3z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-xl font-bold tracking-tight text-foreground">
                Trallo
              </h1>
              <p class="text-xs text-muted-foreground">Workspace</p>
            </div>
          </div>
        </div>

        <!-- Search & Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative hidden md:block">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search boards, cards, members..."
              class="h-10 w-80 rounded-lg border border-input bg-background/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <!-- Create Button -->
          <button
            class="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 cursor-pointer"
          >
            <Plus class="mr-2 h-4 w-4" />
            Create
          </button>

          <!-- Notifications -->
          <button
            class="relative flex h-10 w-10 items-center justify-center rounded-lg border border-input bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <Bell class="h-4 w-4" />
            <div
              class="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"
            ></div>
          </button>

          <!-- User Menu Dropdown -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer"
              :title="user?.email || 'User'"
            >
              {{
                user?.user_metadata?.first_name?.[0] || user?.email?.[0] || "U"
              }}
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-border/50 rounded-lg border border-border/50 bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur supports-[backdrop-filter]:bg-card/95"
              >
                <!-- User Info Section -->
                <div class="px-4 py-3">
                  <p class="text-sm font-medium text-foreground truncate">
                    {{
                      user?.user_metadata?.full_name ||
                      user?.user_metadata?.first_name ||
                      "User"
                    }}
                  </p>
                  <p class="text-xs text-muted-foreground truncate">
                    {{ user?.email || "user@example.com" }}
                  </p>
                </div>

                <!-- Navigation Links -->
                <div class="py-1">
                  <NuxtLink
                    to="/profile"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <User class="mr-3 h-4 w-4" />
                    Your Profile
                  </NuxtLink>

                  <NuxtLink
                    to="/account/settings"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Settings class="mr-3 h-4 w-4" />
                    Account Settings
                  </NuxtLink>

                  <NuxtLink
                    to="/billing"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <CreditCard class="mr-3 h-4 w-4" />
                    Billing
                  </NuxtLink>

                  <NuxtLink
                    to="/help"
                    @click="closeUserMenu"
                    class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <HelpCircle class="mr-3 h-4 w-4" />
                    Help & Support
                  </NuxtLink>
                </div>

                <!-- Sign Out Section -->
                <div class="py-1">
                  <button
                    @click="handleSignOut"
                    class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut class="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="sticky top-16 h-[calc(100vh-4rem)] w-72 border-r border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30"
      >
        <nav class="h-full overflow-y-auto p-6">
          <!-- Navigation -->
          <div class="space-y-6">
            <div>
              <h2
                class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Navigation
              </h2>
              <div class="space-y-2">
                <NuxtLink
                  to="/workspace"
                  class="flex items-center space-x-3 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground shadow-sm transition-colors cursor-pointer"
                >
                  <LayoutDashboard class="h-4 w-4" />
                  <span>Boards</span>
                </NuxtLink>

                <a
                  href="#"
                  class="flex items-center space-x-3 rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <Layout class="h-4 w-4" />
                  <span>Templates</span>
                </a>

                <NuxtLink
                  to="/dashboard"
                  class="flex items-center space-x-3 rounded-lg px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                >
                  <Home class="h-4 w-4" />
                  <span>Home</span>
                </NuxtLink>
              </div>
            </div>

            <!-- Workspace -->
            <div>
              <h2
                class="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Workspace
              </h2>

              <div
                class="rounded-lg border border-border/50 bg-card p-4 shadow-sm"
              >
                <div class="mb-4 flex items-center space-x-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-sm font-bold text-white"
                  >
                    T
                  </div>
                  <span class="font-medium text-foreground"
                    >Trallo Workspace</span
                  >
                </div>

                <div class="space-y-2">
                  <a
                    href="#"
                    class="flex items-center space-x-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <LayoutDashboard class="h-3 w-3" />
                    <span>Boards</span>
                  </a>
                  <a
                    href="#"
                    class="flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <div class="flex items-center space-x-3">
                      <Users class="h-3 w-3" />
                      <span>Members</span>
                    </div>
                    <Plus class="h-3 w-3" />
                  </a>
                  <a
                    href="#"
                    class="flex items-center space-x-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Settings class="h-3 w-3" />
                    <span>Settings</span>
                  </a>
                  <a
                    href="#"
                    class="flex items-center space-x-3 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <CreditCard class="h-3 w-3" />
                    <span>Billing</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-8">
        <div class="mx-auto max-w-7xl space-y-8">
          <!-- Recently Viewed -->
          <section>
            <div class="mb-6 flex items-center space-x-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                <Clock class="h-5 w-5" />
              </div>
              <h2 class="text-xl font-semibold tracking-tight text-foreground">
                Recently viewed
              </h2>
            </div>

            <div class="group cursor-pointer max-w-52 relative">
              <div
                class="overflow-hidden rounded-xl shadow-md transition-all group-hover:shadow-xl group-hover:grayscale-50"
              >
                <div
                  class="h-24 w-80 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
                ></div>
                <!-- Star icon for favorites -->
                <div
                  class="absolute top-2 right-2 w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white/30"
                  :class="{
                    'line-through text-white/60': false,
                    'translate-x-6': false,
                    'translate-x-6 group-hover:translate-x-0': !false,
                  }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-star-icon lucide-star"
                  >
                    <path
                      d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    />
                  </svg>
                </div>
              </div>
              <h3 class="mt-3 font-medium text-foreground">My Trallo board</h3>
              <p class="text-sm text-muted-foreground">Updated 2 hours ago</p>
            </div>
          </section>

          <!-- Your Workspaces -->
          <section>
            <h2
              class="mb-6 text-xl font-semibold tracking-tight text-foreground"
            >
              Your Workspaces
            </h2>

            <div
              class="rounded-xl border border-border/50 bg-card/50 p-8 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/30"
            >
              <!-- Workspace Header -->
              <div class="mb-8 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-lg font-bold text-white shadow-lg"
                  >
                    T
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-foreground">
                      Trallo Workspace
                    </h3>
                    <p class="text-sm text-muted-foreground">Free workspace</p>
                  </div>
                </div>

                <div class="flex space-x-2">
                  <button
                    class="inline-flex items-center space-x-2 rounded-lg border border-input bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <LayoutDashboard class="h-4 w-4" />
                    <span>Boards</span>
                  </button>

                  <button
                    class="inline-flex items-center space-x-2 rounded-lg border border-input bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Users class="h-4 w-4" />
                    <span>Members</span>
                  </button>

                  <button
                    class="inline-flex items-center space-x-2 rounded-lg border border-input bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Settings class="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              <!-- Boards Grid -->
              <div
                class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <!-- Existing Boards -->
                <div
                  v-for="board in boards"
                  :key="board.id"
                  class="group cursor-pointer relative"
                >
                  <div
                    class="overflow-hidden rounded-xl shadow-md transition-all group-hover:shadow-xl"
                  >
                    <div
                      class="h-28"
                      :style="{ background: board.background }"
                    ></div>
                    <!-- Star icon for favorites -->
                    <div
                      class="absolute top-2 right-2 w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white/30"
                      @click.stop="toggleFavorite(board.id)"
                    >
                      <Star
                        class="h-4 w-4"
                        :class="
                          board.isFavorite
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white'
                        "
                      />
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4
                      class="font-medium text-foreground group-hover:text-primary"
                    >
                      {{ board.title }}
                    </h4>
                    <p class="text-sm text-muted-foreground">
                      {{ board.lists }} lists • {{ board.cards }} cards
                    </p>
                  </div>
                </div>

                <!-- Create New Board -->
                <div class="relative" ref="createBoardRef">
                  <button
                    @click="toggleCreateBoardDropdown"
                    class="group flex h-28 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-background/50 transition-all hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
                  >
                    <div
                      class="mb-2 rounded-full bg-primary/10 p-3 transition-colors group-hover:bg-primary/20"
                    >
                      <Plus class="h-6 w-6 text-primary" />
                    </div>
                    <span
                      class="text-sm font-medium text-muted-foreground group-hover:text-foreground"
                      >Create new board</span
                    >
                  </button>

                  <!-- Create Board Dropdown -->
                  <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0 translate-y-2"
                    enter-to-class="transform scale-100 opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="transform scale-100 opacity-100 translate-y-0"
                    leave-to-class="transform scale-95 opacity-0 translate-y-2"
                  >
                    <div
                      v-if="isCreateBoardDropdownOpen"
                      class="absolute -top-2 left-60 mt-2 w-80 z-50 rounded-xl bg-card border border-border/50 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-card/95"
                    >
                      <!-- Dropdown Header -->
                      <div
                        class="flex items-center justify-between border-b border-border/50 px-4 py-3"
                      >
                        <h3 class="text-sm font-semibold text-foreground">
                          Create board
                        </h3>
                        <button
                          @click="closeCreateBoardDropdown"
                          class="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <X class="h-3 w-3" />
                        </button>
                      </div>

                      <!-- Dropdown Content -->
                      <div class="p-4 space-y-4">
                        <!-- Board Preview -->
                        <div class="mb-6">
                          <div
                            class="relative h-20 w-full overflow-hidden rounded-lg"
                            :style="{
                              backgroundImage: `url(${selectedBackground})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }"
                          >
                            <!-- Preview columns -->
                            <div
                              class="absolute inset-0 flex items-center justify-center space-x-2 p-4"
                            >
                              <div
                                class="h-12 w-16 rounded bg-white/20 backdrop-blur-sm"
                              ></div>
                              <div
                                class="h-12 w-16 rounded bg-white/20 backdrop-blur-sm"
                              ></div>
                              <div
                                class="h-12 w-16 rounded bg-white/20 backdrop-blur-sm"
                              ></div>
                            </div>
                          </div>
                        </div>

                        <!-- Background Selection -->
                        <div>
                          <h4
                            class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Background
                          </h4>
                          <div class="grid grid-cols-6 gap-1.5">
                            <!-- Photo Backgrounds -->
                            <div
                              v-for="photo in imageBackgrounds"
                              :key="photo.id"
                              @click="selectBackground(photo.background)"
                              class="group relative h-8 w-full cursor-pointer overflow-hidden rounded-md transition-all hover:scale-105"
                              :class="{
                                'ring-2 ring-primary':
                                  selectedBackground === photo.background,
                              }"
                            >
                              <div
                                class="h-full w-full bg-cover bg-center"
                                :style="{ backgroundImage: photo.background }"
                              ></div>
                              <div
                                class="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/5"
                              ></div>
                            </div>

                            <!-- Color Backgrounds -->
                            <div
                              v-for="color in colorBackgrounds.slice(0, 8)"
                              :key="color.id"
                              @click="selectBackground(color.background)"
                              class="group relative h-8 w-full cursor-pointer overflow-hidden rounded-md transition-all hover:scale-105"
                              :class="{
                                'ring-2 ring-primary':
                                  selectedBackground === color.background,
                              }"
                            >
                              <div
                                class="h-full w-full"
                                :style="{ background: color.background }"
                              ></div>
                            </div>
                          </div>
                        </div>

                        <!-- Board Title -->
                        <div>
                          <label
                            class="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Board title <span class="text-red-500">*</span>
                          </label>
                          <input
                            v-model="boardTitle"
                            type="text"
                            placeholder="e.g., My Project Board"
                            class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            :class="{
                              'border-red-500 focus:border-red-500 focus:ring-red-500/20':
                                showTitleError,
                            }"
                            @input="showTitleError = false"
                          />
                          <div
                            v-if="showTitleError"
                            class="mt-1 flex items-center space-x-1 text-xs text-red-500"
                          >
                            <AlertCircle class="h-3 w-3" />
                            <span>Board title is required</span>
                          </div>
                        </div>

                        <!-- Visibility -->
                        <div>
                          <label
                            class="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            Visibility
                          </label>
                          <select
                            v-model="boardVisibility"
                            class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="workspace">Workspace</option>
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                          </select>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col space-y-2 pt-2">
                          <button
                            @click="createBoard"
                            :disabled="!boardTitle.trim()"
                            class="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                          >
                            Create
                          </button>
                          <button
                            @click="openTemplateModal"
                            class="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            Templates
                          </button>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>

              <!-- View All Boards Link -->
              <div class="mt-6 border-t border-border/50 pt-6">
                <a
                  href="#"
                  class="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  <span>View all closed boards</span>
                  <ChevronRight class="h-4 w-4" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

  </div>
</template>

<script setup>
import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  Layout,
  Home,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Users,
  User,
  LogOut,
  HelpCircle,
  X,
  Star,
  MoreHorizontal,
  AlertCircle,
} from "lucide-vue-next";

// Apply auth middleware to this page
definePageMeta({
  middleware: "auth",
});

const user = useSupabaseUser();
const { signOut } = useAuth();

// User menu dropdown state
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

// Create board dropdown state (replacing modal)
const isCreateBoardDropdownOpen = ref(false);
const createBoardRef = ref(null);
const boardTitle = ref("");
const boardVisibility = ref("workspace");
const selectedBackground = ref("");
const showTitleError = ref(false);

// Sample boards data
const boards = ref([
  {
    id: 1,
    title: "My Trallo board",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    lists: 3,
    cards: 12,
    isFavorite: false,
  },
]);

const imageBackgrounds = ref([
  {
    id: 1,
    background:
      'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop")',
  },
  {
    id: 2,
    background:
      'url("https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=300&fit=crop")',
  },
  {
    id: 3,
    background:
      'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop")',
  },
  {
    id: 4,
    background:
      'url("https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop")',
  },
]);

const colorBackgrounds = ref([
  {
    id: 1,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 3,
    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: 4,
    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    id: 5,
    background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: 6,
    background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
  {
    id: 7,
    background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  },
]);

// Set default background
onMounted(() => {
  selectedBackground.value = imageBackgrounds[0];
});

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = () => {
  isUserMenuOpen.value = false;
};

const handleSignOut = async () => {
  closeUserMenu();
  await signOut();
};

// Dropdown functions
const toggleCreateBoardDropdown = () => {
  isCreateBoardDropdownOpen.value = !isCreateBoardDropdownOpen.value;
  if (isCreateBoardDropdownOpen.value) {
    boardTitle.value = "";
    showTitleError.value = false;
  }
};

const closeCreateBoardDropdown = () => {
  isCreateBoardDropdownOpen.value = false;
  boardTitle.value = "";
  showTitleError.value = false;
};

const selectBackground = (background) => {
  selectedBackground.value = background;
};

const toggleFavorite = (boardId) => {
  const board = boards.value.find((b) => b.id === boardId);
  if (board) {
    board.isFavorite = !board.isFavorite;
  }
};

const createBoard = () => {
  if (!boardTitle.value.trim()) {
    showTitleError.value = true;
    return;
  }

  // Create new board
  const newBoard = {
    id: Date.now(), // Simple ID generation
    title: boardTitle.value.trim(),
    background: selectedBackground.value,
    lists: 0,
    cards: 0,
    isFavorite: false,
  };

  boards.value.push(newBoard);
  closeCreateBoardDropdown();

  // Here you would typically navigate to the new board or make an API call
  console.log("Created board:", newBoard);
};

const openTemplateModal = () => {
  // This would open a template selection modal
  console.log("Opening template modal...");
};

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener("click", (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      isUserMenuOpen.value = false;
    }
    if (createBoardRef.value && !createBoardRef.value.contains(event.target)) {
      isCreateBoardDropdownOpen.value = false;
    }
  });
});

// Close dropdown on escape key
onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (isCreateBoardDropdownOpen.value) {
        closeCreateBoardDropdown();
      }
      if (isUserMenuOpen.value) {
        closeUserMenu();
      }
    }
  });
});
</script>

<style scoped>
/* Custom scrollbar for sidebar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--border) / 0.8);
}

/* Custom styles for modal backdrop */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
