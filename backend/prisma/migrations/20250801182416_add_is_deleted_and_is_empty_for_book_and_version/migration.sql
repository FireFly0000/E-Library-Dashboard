-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_empty" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "BookVersion" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "idx_book_is_empty" ON "Book"("is_empty");

-- CreateIndex
CREATE INDEX "idx_book_category_id" ON "Book"("category_id");

-- CreateIndex
CREATE INDEX "idx_book_category_id_created" ON "Book"("category_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_book_is_deleted" ON "BookVersion"("is_deleted");
