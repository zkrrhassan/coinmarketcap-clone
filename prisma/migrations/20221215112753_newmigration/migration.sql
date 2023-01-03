/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Comment_authorId_key";

-- DropIndex
DROP INDEX "Comment_postId_key";

-- DropIndex
DROP INDEX "Post_authorId_key";

-- DropIndex
DROP INDEX "Watchlist_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");
