/*
  Warnings:

  - A unique constraint covering the columns `[name,country]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Author_name_country_key" ON "Author"("name", "country");

-- CreateIndex
CREATE INDEX "idx_category_code" ON "Category"("category_code");
