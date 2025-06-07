/*
  Warnings:

  - You are about to alter the column `name` on the `Author` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(51)`.
  - You are about to alter the column `country` on the `Author` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `file_name` on the `Book` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `Book` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[slug]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoryCode" AS ENUM ('FIC', 'SCI', 'BIO', 'ROM', 'FANT', 'THR', 'HIST', 'MYST', 'HORR');

-- DropIndex
DROP INDEX "Author_name_date_of_birth_country_idx";

-- DropIndex
DROP INDEX "Book_title_author_id_created_at_idx";

-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "name" SET DATA TYPE VARCHAR(51),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "file_name",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "slug" VARCHAR(100) NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" TEXT NOT NULL,
    "url_avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_verify" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookVersion" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "book_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "category_code" "CategoryCode" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_email" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_username" ON "User"("username");

-- CreateIndex
CREATE INDEX "idx_book_versions_user_id" ON "BookVersion"("user_id");

-- CreateIndex
CREATE INDEX "idx_book_versions_created_at" ON "BookVersion"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_code_key" ON "Category"("category_code");

-- CreateIndex
CREATE INDEX "idx_category_name" ON "Category"("name");

-- CreateIndex
CREATE INDEX "idx_author_name" ON "Author"("name");

-- CreateIndex
CREATE INDEX "idx_author_country" ON "Author"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE INDEX "idx_book_title" ON "Book"("title");

-- CreateIndex
CREATE INDEX "idx_book_author_id" ON "Book"("author_id");

-- CreateIndex
CREATE INDEX "idx_book_created_at" ON "Book"("created_at");

-- AddForeignKey
ALTER TABLE "BookVersion" ADD CONSTRAINT "BookVersion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookVersion" ADD CONSTRAINT "BookVersion_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
