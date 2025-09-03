import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Board id is required",
      });
    }

    const board = await prisma.board.findFirst({
      where: {
        id,
        status: "ACTIVE",
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
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
        lists: {
          where: { status: "ACTIVE" },
          include: {
            cards: {
              where: { isArchived: false },
            },
          },
          orderBy: { position: "asc" },
        },
        _count: { select: { lists: true, members: true } },
      },
    });

    if (!board) {
      throw createError({ statusCode: 404, statusMessage: "Board not found" });
    }

    return board;
  } catch (error) {
    console.error("Error fetching board by id:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch board",
    });
  }
});
