/*
  Warnings:

  - You are about to drop the column `payload` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `data` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."notifications" DROP COLUMN "payload",
DROP COLUMN "type",
ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
