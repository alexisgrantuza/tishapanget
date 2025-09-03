import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized - User not authenticated",
      });
    }

    const body = await readBody(event);
    const { boardId, name, color } = body || {};

    if (!boardId || !name) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        status: "ACTIVE",
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
      select: { id: true },
    });

    if (!board) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    const last = await prisma.list.findFirst({
      where: { boardId, status: "ACTIVE" },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const position = last ? last.position + 1 : 1;

    const created = await prisma.list.create({
      data: {
        name,
        position,
        boardId,
        status: "ACTIVE",
        color: color || "#4a5568",
      },
      include: {
        cards: {
          where: { isArchived: false },
          select: { id: true, title: true, isArchived: true },
        },
      },
    });

    return created;
  } catch (error) {
    console.error("Error fetching list by id:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch list",
    });
  }
});
