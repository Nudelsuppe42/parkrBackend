/*
  Warnings:

  - You are about to drop the column `apiKey` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_apiKey_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `apiKey`;
