import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, email, username, firstName, lastName, avatar } = body;

    if (!id || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: "User ID and email are required",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return { success: true, user: existingUser };
    }

    // Check for unique username
    let finalUsername = username;
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      finalUsername = `${username}_${Date.now()}`;
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id,
        email,
        username: finalUsername,
        firstName: firstName || "User",
        lastName: lastName || "",
        avatar,
      },
    });

    return { success: true, user };
  } catch (error: any) {
    console.error("Create user error:", error);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
