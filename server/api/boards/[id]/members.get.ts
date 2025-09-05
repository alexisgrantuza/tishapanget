import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const boardId = getRouterParam(event, "id");

    if (!boardId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Board ID is required",
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

    // Check if user has access (owner or member)
    const isOwner = board.ownerId === user.id;
    const isMember = await prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userId: user.id,
      },
    });

    if (!isOwner && !isMember) {
      throw createError({
        statusCode: 403,
        statusMessage: "Insufficient permissions to view board members",
      });
    }

    // If user is owner but not a member, add them as OWNER
    if (isOwner && !isMember) {
      await prisma.boardMember.create({
        data: {
          boardId: boardId,
          userId: user.id,
          role: "OWNER",
        },
      });
    }

    // Get board members with user details
    const members = await prisma.boardMember.findMany({
      where: {
        boardId: boardId,
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
      orderBy: {
        joinedAt: "asc",
      },
    });

    return {
      success: true,
      members,
    };
  } catch (error: any) {
    console.error("Error fetching board members:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch board members",
    });
  }
});
