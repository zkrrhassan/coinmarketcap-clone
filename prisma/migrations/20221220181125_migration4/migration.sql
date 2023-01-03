/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `displayName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biography" VARCHAR(160),
ADD COLUMN     "website" VARCHAR(100),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "displayName" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "description" TEXT;
