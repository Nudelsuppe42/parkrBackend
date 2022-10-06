-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_vehicleId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `vehicleId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `UserVehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
