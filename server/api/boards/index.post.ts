import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, background, workspaceId, isPrivate } = body;

    // Validate required fields
    if (!title || !workspaceId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Title and workspaceId are required",
      });
    }

    // Create board in database
    const board = await prisma.board.create({
      data: {
        name: title,
        color: background,
        isPrivate: isPrivate || false,
        ownerId: "user-id-from-auth", // Get from auth context
        workspaceId: workspaceId,
        status: "ACTIVE",
      },
      include: {
        owner: true,
        workspace: true,
      },
    });

    return board;
  } catch (error) {
    console.error("Error creating board:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create board",
    });
  }
});
