<template>
  <Dialog :open="isOpen" @update:open="closeModal">
    <DialogContent class="max-w-xl bg-black text-white border-none">
      <DialogHeader>
        <DialogTitle>Share board</DialogTitle>
        <DialogDescription>
          Share this board with a link or invite members to join.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Invite Section -->
        <div class="space-y-4">
          <div class="flex gap-2">
            <Input
              v-model="inviteEmail"
              type="email"
              placeholder="Email address or name"
              class="flex-1"
            />
            <Select v-model="selectedRole">
              <SelectTrigger class="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="OBSERVER">Observer</SelectItem>
              </SelectContent>
            </Select>
            <Button
              @click="inviteMember"
              :disabled="!inviteEmail.trim() || isInviting"
              variant="secondary"
              class="cursor-pointer"
            >
              {{ isInviting ? "Sharing..." : "Share" }}
            </Button>
          </div>
        </div>

        <!-- Share with Link Section -->
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-muted-foreground">
            <Link class="h-4 w-4" />
            <span class="text-sm">Share this board with a link</span>
          </div>
          <Button
            @click="createShareLink"
            variant="link"
            class="p-0 h-auto text-muted-background hover:text-background text-sm"
          >
            Create link
          </Button>
        </div>

        <!-- Tabs -->
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="members" class="relative cursor-pointer">
              Board members
              <Badge
                v-if="boardMembers.length > 0"
                variant="secondary"
                class="ml-2 h-5 min-w-5 text-xs"
              >
                {{ boardMembers.length }}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              v-if="canViewRequests"
              value="requests"
              class="relative cursor-pointer"
            >
              Join requests
              <Badge
                v-if="joinRequests.length > 0"
                variant="secondary"
                class="ml-2 h-5 min-w-5 text-xs"
              >
                {{ joinRequests.length }}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <!-- Board Members Tab -->
          <TabsContent value="members" class="space-y-3 mt-4">
            <Card v-for="member in boardMembers" :key="member.id" class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback
                      class="bg-primary text-primary-foreground text-sm"
                    >
                      {{
                        getInitials(member.user.firstName, member.user.lastName)
                      }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="font-medium">
                      {{ member.user.firstName }} {{ member.user.lastName }}
                      <span
                        v-if="member.userId === currentUserId"
                        class="text-muted-foreground"
                        >(you)</span
                      >
                    </p>
                    <p class="text-muted-foreground text-sm">
                      @{{ member.user.username }} •
                      {{ getRoleDisplayName(member.role) }}
                    </p>
                  </div>
                </div>
                <Select
                  v-if="member.userId !== currentUserId && canChangeRole"
                  :model-value="member.role"
                  @update:model-value="updateMemberRole(member.id, $event)"
                >
                  <SelectTrigger class="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="OBSERVER">Observer</SelectItem>
                  </SelectContent>
                </Select>
                <Badge v-else variant="outline">
                  {{ getRoleDisplayName(member.role) }}
                </Badge>
              </div>
            </Card>
          </TabsContent>

          <!-- Join Requests Tab -->
          <TabsContent
            v-if="canViewRequests"
            value="requests"
            class="space-y-3 mt-4"
          >
            <Card v-for="request in joinRequests" :key="request.id" class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback class="bg-muted text-muted-foreground">
                      {{
                        getInitials(
                          request.user.firstName,
                          request.user.lastName
                        )
                      }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="font-medium">
                      {{ request.user.firstName }} {{ request.user.lastName }}
                    </p>
                    <p class="text-muted-foreground text-sm">
                      @{{ request.user.username }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <Button
                    @click="approveRequest(request.id)"
                    size="sm"
                    class="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    @click="rejectRequest(request.id)"
                    variant="destructive"
                    size="sm"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
            <div
              v-if="joinRequests.length === 0"
              class="text-center text-muted-foreground py-8"
            >
              No pending requests
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Link } from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DialogDescription from "./ui/dialog/DialogDescription.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  boardId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

// State
const inviteEmail = ref("");
const selectedRole = ref("MEMBER");
const isInviting = ref(false);
const activeTab = ref("members");
const boardMembers = ref([]);
const joinRequests = ref([]);
const currentUserId = ref("");

// Computed
const canChangeRole = computed(() => {
  // Only board owners and admins can change roles
  const currentMember = boardMembers.value.find(
    (m) => m.userId === currentUserId.value
  );
  return currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";
});

// Only owners/admins can view join requests
const canViewRequests = computed(() => canChangeRole.value);

// Methods
const closeModal = (open) => {
  if (!open) {
    emit("close");
  }
};

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const getRoleDisplayName = (role) => {
  const roleMap = {
    OWNER: "Workspace owner",
    ADMIN: "Workspace admin",
    MEMBER: "Member",
    OBSERVER: "Observer",
  };
  return roleMap[role] || role;
};

const inviteMember = async () => {
  if (!inviteEmail.value.trim() || !props.boardId) return;

  try {
    isInviting.value = true;
    const response = await $fetch("/api/boards/invite", {
      method: "POST",
      body: {
        boardId: props.boardId,
        email: inviteEmail.value.trim(),
        role: selectedRole.value,
      },
    });

    toast.success("Invitation sent successfully!");
    inviteEmail.value = "";
    await fetchBoardMembers();
  } catch (error) {
    console.error("Failed to invite member:", error);
    toast.error("Failed to send invitation. Please try again.");
  } finally {
    isInviting.value = false;
  }
};

const createShareLink = async () => {
  if (!props.boardId) return;

  try {
    const response = await $fetch("/api/boards/share-link", {
      method: "POST",
      body: {
        boardId: props.boardId,
      },
    });

    // Copy to clipboard
    await navigator.clipboard.writeText(response.shareLink);
    toast.success("Share link copied to clipboard!");
  } catch (error) {
    console.error("Failed to create share link:", error);
    toast.error("Failed to create share link. Please try again.");
  }
};

const updateMemberRole = async (memberId, newRole) => {
  try {
    await $fetch("/api/boards/members/role", {
      method: "PATCH",
      body: {
        memberId,
        role: newRole,
      },
    });

    toast.success("Member role updated successfully!");
    await fetchBoardMembers();
  } catch (error) {
    console.error("Failed to update member role:", error);
    toast.error("Failed to update member role. Please try again.");
  }
};

const approveRequest = async (requestId) => {
  try {
    await $fetch("/api/boards/requests/approve", {
      method: "POST",
      body: { requestId },
    });

    toast.success("Request approved!");
    await fetchJoinRequests();
    await fetchBoardMembers();
  } catch (error) {
    console.error("Failed to approve request:", error);
    toast.error("Failed to approve request. Please try again.");
  }
};

const rejectRequest = async (requestId) => {
  try {
    await $fetch("/api/boards/requests/reject", {
      method: "POST",
      body: { requestId },
    });

    toast.success("Request rejected!");
    await fetchJoinRequests();
  } catch (error) {
    console.error("Failed to reject request:", error);
    toast.error("Failed to reject request. Please try again.");
  }
};

const fetchBoardMembers = async () => {
  if (!props.boardId) return;

  try {
    const response = await $fetch(`/api/boards/${props.boardId}/members`);
    boardMembers.value = response.members || [];
  } catch (error) {
    console.error("Failed to fetch board members:", error);
  }
};

const fetchJoinRequests = async () => {
  if (!props.boardId) return;
  if (!canViewRequests.value) return;

  try {
    const response = await $fetch(`/api/boards/${props.boardId}/requests`);
    joinRequests.value = response.requests || [];
  } catch (error) {
    console.error("Failed to fetch join requests:", error);
  }
};

const fetchCurrentUser = async () => {
  try {
    const user = useSupabaseUser();
    if (user.value) {
      currentUserId.value = user.value.id;
    }
  } catch (error) {
    console.error("Failed to fetch current user:", error);
  }
};

// Watch for boardId changes and fetch data when available
watch(
  () => props.boardId,
  async (newBoardId) => {
    if (newBoardId) {
      await fetchBoardMembers();
      if (canViewRequests.value) {
        await fetchJoinRequests();
      } else {
        joinRequests.value = [];
        if (activeTab.value === "requests") activeTab.value = "members";
      }
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(async () => {
  await fetchCurrentUser();
  if (props.boardId) {
    await fetchBoardMembers();
    if (canViewRequests.value) {
      await fetchJoinRequests();
    }
  }
});
</script>
