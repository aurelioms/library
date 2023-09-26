/*
  Warnings:

  - You are about to drop the `bookpublisherpivot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `publisherId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookpublisherpivot` DROP FOREIGN KEY `BookPublisherPivot_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `bookpublisherpivot` DROP FOREIGN KEY `BookPublisherPivot_publisherId_fkey`;

-- AlterTable
ALTER TABLE `book` ADD COLUMN `publisherId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `bookpublisherpivot`;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `Publisher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
