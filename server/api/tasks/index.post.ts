import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    }

    const body = await readBody(event);
    const { listId, title, description, priority, dueDate } = body || {};

    if (!listId || !title?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: "listId and title are required",
      });
    }

    // Verify user can access the list via its board (owner or member)
    const list = await prisma.list.findFirst({
      where: {
        id: listId,
        status: "ACTIVE",
        board: {
          status: "ACTIVE",
          OR: [
            { ownerId: user.id },
            { members: { some: { userId: user.id } } },
          ],
        },
      },
      select: { id: true },
    });

    if (!list) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    const last = await prisma.card.findFirst({
      where: { listId, isArchived: false },
      orderBy: { position: "desc" },
      select: { position: true },
    });
    const position = last ? last.position + 1 : 1;

    const created = await prisma.card.create({
      data: {
        title: title.trim(),
        description: description || null,
        priority: priority || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        position,
        listId,
        creatorId: user.id,
      },
    });

    return created;
  } catch (error) {
    console.error("Error creating task:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create task",
    });
  }
});
