/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licensePlate]` on the table `UserVehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `UserVehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licensePlate` to the `UserVehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `UserVehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `apiKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `uservehicle` ADD COLUMN `length` INTEGER NOT NULL,
    ADD COLUMN `licensePlate` VARCHAR(191) NOT NULL,
    ADD COLUMN `width` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `ServiceStation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `location` JSON NOT NULL,
    `area` JSON NOT NULL,
    `aviable` INTEGER NOT NULL,
    `reserved` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `services` JSON NOT NULL,

    UNIQUE INDEX `ServiceStation_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_apiKey_key` ON `User`(`apiKey`);

-- CreateIndex
CREATE UNIQUE INDEX `UserVehicle_licensePlate_key` ON `UserVehicle`(`licensePlate`);
