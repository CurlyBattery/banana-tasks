/*
  Warnings:

  - Made the column `department_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "department_id" SET NOT NULL;
