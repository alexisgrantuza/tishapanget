import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { boardId } = body;

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

    // Get member
    const member = await prisma.boardMember.findFirst({
      where: {
        userId: user.id,
        boardId: boardId,
      },
    });

    if (!member) {
      throw createError({
        statusCode: 403,
        statusMessage: "You are not a member of this board",
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

    // Check if user has permission to create share links
    const isOwner = board.ownerId === user.id;
    const boardMember = await prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userId: user.id,
      },
    });

    if (!boardMember) {
      throw createError({
        statusCode: 403,
        statusMessage: "You are not a member of this board",
      });
    }

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
        statusMessage: "Insufficient permissions to create share links",
      });
    }

    // Generate a unique share token
    const shareToken = randomBytes(32).toString("hex");

    // For now, we'll just return a share link with the token
    // In a real app, you might want to store this in the database
    const shareLink = `${getRequestURL(event).origin}/boards/${boardId}/join?token=${shareToken}`;

    return {
      success: true,
      shareLink,
      shareToken,
    };
  } catch (error: any) {
    console.error("Error creating share link:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create share link",
    });
  }
});
