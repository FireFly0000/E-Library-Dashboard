-- CreateIndex
CREATE INDEX "idx_book_versions_book_id_is_trashed" ON "BookVersion"("book_id", "is_trashed");
