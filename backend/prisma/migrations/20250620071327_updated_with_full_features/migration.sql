/*
  Warnings:

  - You are about to drop the column `comment_count` on the `BookVersion` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('TO_READ', 'OPENED', 'ABANDONED');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "comment_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "BookVersion" DROP COLUMN "comment_count",
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingList" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'TO_READ',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_comment_user_id" ON "Comment"("user_id");

-- CreateIndex
CREATE INDEX "idx_comment_book_id" ON "Comment"("book_id");

-- CreateIndex
CREATE INDEX "idx_comment_parent_id" ON "Comment"("parent_id");

-- CreateIndex
CREATE INDEX "idx_comment_created_at" ON "Comment"("created_at");

-- CreateIndex
CREATE INDEX "idx_reading_list_user_id" ON "ReadingList"("user_id");

-- CreateIndex
CREATE INDEX "idx_reading_list_book_id" ON "ReadingList"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingList_user_id_book_id_key" ON "ReadingList"("user_id", "book_id");

-- CreateIndex
CREATE INDEX "idx_book_view_count" ON "Book"("view_count");

-- CreateIndex
CREATE INDEX "idx_book_versions_view_count" ON "BookVersion"("view_count");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingList" ADD CONSTRAINT "ReadingList_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
