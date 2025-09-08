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
        statusMessage: "List id is required",
      });
    }

    const body = await readBody(event);
    const { name, color, position } = body || {};

    const list = await prisma.list.findFirst({
      where: {
        id,
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
      throw createError({ statusCode: 404, statusMessage: "List not found" });
    }

    const updated = await prisma.list.update({
      where: { id },
      data: {
        name: typeof name === "string" ? name : undefined,
        color: typeof color === "string" ? color : undefined,
        position: typeof position === "number" ? position : undefined,
      },
    });

    return updated;
  } catch (error) {
    console.error("Error updating list:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update list",
    });
  }
});