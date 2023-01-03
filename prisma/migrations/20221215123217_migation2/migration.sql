/*
  Warnings:

  - You are about to drop the column `isMain` on the `Watchlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[is_main]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "isMain",
ADD COLUMN     "is_main" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_is_main_key" ON "Watchlist"("is_main");
