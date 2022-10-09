/*
  Warnings:

  - Changed the type of `aviable` on the `servicestation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reserved` on the `servicestation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `total` on the `servicestation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `servicestation` DROP COLUMN `aviable`,
    ADD COLUMN `aviable` JSON NOT NULL,
    DROP COLUMN `reserved`,
    ADD COLUMN `reserved` JSON NOT NULL,
    DROP COLUMN `total`,
    ADD COLUMN `total` JSON NOT NULL;
