import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { boardId, email, role = "MEMBER" } = body;

    if (!boardId || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Board ID and email are required",
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

    // Get board to check if user is owner
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true },
    });

    if (!board) {
      throw createError({
        statusCode: 404,
        statusMessage: "Board not found",
      });
    }

    // Check if user has permission to invite (owner or admin)
    const isOwner = board.ownerId === user.id;
    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userId: user.id,
      },
    });

    // If user is owner but not a member, add them as OWNER
    if (isOwner && !boardMember) {
      await prisma.boardMember.create({
        data: {
          boardId: boardId,
          userId: user.id,
          role: "OWNER",
        },
      });
    }

    if (
      !isOwner &&
      (!boardMember ||
        (boardMember.role !== "OWNER" && boardMember.role !== "ADMIN"))
    ) {
      throw createError({
        statusCode: 403,
        statusMessage: "Insufficient permissions to invite members",
      });
    }

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!invitedUser) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found with this email",
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userId: invitedUser.id,
      },
    });

    if (existingMember) {
      throw createError({
        statusCode: 409,
        statusMessage: "User is already a member of this board",
      });
    }

    // Add user as board member
    const newMember = await prisma.boardMember.create({
      data: {
        boardId: boardId,
        userId: invitedUser.id,
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
        type: "MEMBER_ADDED",
        data: {
          memberId: newMember.id,
          memberName: `${invitedUser.firstName} ${invitedUser.lastName}`,
          role: role,
        },
        boardId: boardId,
        userId: user.id,
      },
    });

    return {
      success: true,
      member: newMember,
    };
  } catch (error: any) {
    console.error("Error inviting member:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to invite member",
    });
  }
});
