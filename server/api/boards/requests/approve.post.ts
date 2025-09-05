import { serverSupabaseUser } from "#supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { requestId } = body;

    if (!requestId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Request ID is required",
      });
    }

    // Get current user
    const user = await serverSupabaseUser(event);
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    // For now, just return success since we don't have a join request system
    // In a real app, you would:
    // 1. Find the join request
    // 2. Check if user has permission to approve
    // 3. Add the user as a board member
    // 4. Delete the join request

    return {
      success: true,
      message: "Request approved successfully",
    };
  } catch (error: any) {
    console.error("Error approving request:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to approve request",
    });
  }
});
