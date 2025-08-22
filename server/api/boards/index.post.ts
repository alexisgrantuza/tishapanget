// server/api/boards/index.post.ts
import { prisma } from "~/utils/prisma";
import { z } from "zod";

const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  color: z.string().default("#3B82F6"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = createBoardSchema.parse(body);

    const board = await prisma.board.create({
      data: validatedData,
      include: {
        lists: {
          include: {
            tasks: {
              include: {
                tags: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Create default lists for new board
    const defaultLists = [
      { title: "To Do", position: 1 },
      { title: "In Progress", position: 2 },
      { title: "Done", position: 3 },
    ];

    await prisma.list.createMany({
      data: defaultLists.map((list) => ({
        ...list,
        boardId: board.id,
      })),
    });

    // Fetch the board with the new lists
    const boardWithLists = await prisma.board.findUnique({
      where: { id: board.id },
      include: {
        lists: {
          include: {
            tasks: {
              include: {
                tags: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    return {
      success: true,
      data: boardWithLists,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation error",
        data: error.errors,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create board",
    });
  }
});
