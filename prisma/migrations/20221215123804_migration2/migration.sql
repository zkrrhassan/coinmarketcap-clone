/*
  Warnings:

  - You are about to drop the column `is_main` on the `Watchlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isMain]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isMain` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Watchlist_is_main_key";

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "is_main",
ADD COLUMN     "isMain" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_isMain_key" ON "Watchlist"("isMain");
