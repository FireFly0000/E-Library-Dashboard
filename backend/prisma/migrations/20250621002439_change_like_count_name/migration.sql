/*
  Warnings:

  - You are about to drop the column `likeCount` on the `BookVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookVersion" DROP COLUMN "likeCount",
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0;
