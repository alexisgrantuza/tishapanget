import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - User not authenticated",
      });
    }

    const body = await readBody(event);
    const { title, background, isPrivate } = body;

    // Validate required fields
    if (!title) {
      throw createError({
        statusCode: 400,
        statusMessage: "Title is required",
      });
    }

    // Create board in database
    const board = await prisma.board.create({
      data: {
        name: title,
        color: background || "#0079BF",
        isPrivate: isPrivate || false,
        ownerId: user.id,
        status: "ACTIVE",
        // Add the creator as a board member with OWNER role
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
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
