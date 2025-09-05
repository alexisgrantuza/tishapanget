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

    // Check if user has permission to view requests
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
        statusMessage: "Insufficient permissions to view join requests",
      });
    }

    // For now, return empty array since we don't have a join request system yet
    // In a real app, you would query a join_requests table
    const requests: any[] = [];

    return {
      success: true,
      requests,
    };
  } catch (error: any) {
    console.error("Error fetching join requests:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch join requests",
    });
  }
});
