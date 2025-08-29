import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, email, user_metadata, app_metadata } = body;

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
      // Update existing user with latest OAuth data
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          email,
          avatar: user_metadata?.avatar_url || existingUser.avatar,
          updatedAt: new Date(),
        },
      });
      return { success: true, user: updatedUser, isNew: false };
    }

    // Extract user data from OAuth metadata
    const fullName = user_metadata?.full_name || "";
    const names = fullName.split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    // Generate unique username from email or name
    let username =
      user_metadata?.preferred_username ||
      user_metadata?.user_name ||
      email.split("@")[0];

    // Ensure username is unique
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      username = `${username}_${Date.now()}`;
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id,
        email,
        username,
        firstName: firstName || "User",
        lastName,
        avatar: user_metadata?.avatar_url,
        bio: null,
      },
    });

    return { success: true, user, isNew: true };
  } catch (error: any) {
    console.error("User sync error:", error);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
