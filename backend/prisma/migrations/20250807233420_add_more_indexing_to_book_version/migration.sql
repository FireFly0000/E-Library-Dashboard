-- CreateIndex
CREATE INDEX "idx_book_versions_id_user_id" ON "BookVersion"("id", "user_id");

-- CreateIndex
CREATE INDEX "idx_book_versions_book_id" ON "BookVersion"("book_id");

-- RenameIndex
ALTER INDEX "idx_book_is_trashed" RENAME TO "idx_book_versions_is_trashed";
