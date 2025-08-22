// server/api/tasks/index.get.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { listId, filter = "all" } = query;

    let whereClause: any = {};

    if (listId) {
      whereClause.listId = listId as string;
    }

    if (filter === "completed") {
      whereClause.completed = true;
    } else if (filter === "active") {
      whereClause.completed = false;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        list: true,
        tags: true,
      },
      orderBy: [{ completed: "asc" }, { position: "asc" }],
    });

    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch tasks",
    });
  }
});
