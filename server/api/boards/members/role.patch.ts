import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { memberId, role } = body;

    if (!memberId || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: "Member ID and role are required",
      });
    }

    // Get current user
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    // Get the member being updated
    const memberToUpdate = await prisma.boardMember.findUnique({
      where: {
        id: memberId,
      },
      include: {
        user: true,
        board: true,
      },
    });

    if (!memberToUpdate) {
      throw createError({
        statusCode: 404,
        statusMessage: "Member not found",
      });
    }

    // Check if current user has permission to change roles
    const isOwner = memberToUpdate.board.ownerId === user.id;
    const currentUserMember = await prisma.boardMember.findFirst({
      where: {
        boardId: memberToUpdate.boardId,
        userId: user.id,
      },
    });

    // If user is owner but not a member, add them as OWNER
    if (isOwner && !currentUserMember) {
      await prisma.boardMember.create({
        data: {
          boardId: memberToUpdate.boardId,
          userId: user.id,
          role: "OWNER",
        },
      });
    }

    if (
      !isOwner &&
      (!currentUserMember ||
        (currentUserMember.role !== "OWNER" &&
          currentUserMember.role !== "ADMIN"))
    ) {
      throw createError({
        statusCode: 403,
        statusMessage: "Insufficient permissions to change member roles",
      });
    }

    // Prevent non-owners from changing owner roles
    if (memberToUpdate.role === "OWNER" && !isOwner) {
      throw createError({
        statusCode: 403,
        statusMessage: "Only board owners can change owner roles",
      });
    }

    // Update member role
    const updatedMember = await prisma.boardMember.update({
      where: {
        id: memberId,
      },
      data: {
        role: role,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: "MEMBER_ADDED", // Reusing this type for role changes
        data: {
          memberId: updatedMember.id,
          memberName: `${updatedMember.user.firstName} ${updatedMember.user.lastName}`,
          role: role,
          action: "role_changed",
        },
        boardId: memberToUpdate.boardId,
        userId: user.id,
      },
    });

    return {
      success: true,
      member: updatedMember,
    };
  } catch (error: any) {
    console.error("Error updating member role:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update member role",
    });
  }
});
