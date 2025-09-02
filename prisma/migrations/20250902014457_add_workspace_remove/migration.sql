/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `boards` table. All the data in the column will be lost.
  - You are about to drop the `workspace_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."boards" DROP CONSTRAINT "boards_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."workspace_members" DROP CONSTRAINT "workspace_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."workspace_members" DROP CONSTRAINT "workspace_members_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."workspaces" DROP CONSTRAINT "workspaces_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."boards" DROP COLUMN "workspaceId";

-- DropTable
DROP TABLE "public"."workspace_members";

-- DropTable
DROP TABLE "public"."workspaces";
