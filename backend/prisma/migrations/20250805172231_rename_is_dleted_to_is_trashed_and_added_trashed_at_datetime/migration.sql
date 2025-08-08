/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `BookVersion` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_book_is_deleted";

-- AlterTable
ALTER TABLE "BookVersion" DROP COLUMN "is_deleted",
ADD COLUMN     "is_trashed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trashed_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "idx_book_is_trashed" ON "BookVersion"("is_trashed");
