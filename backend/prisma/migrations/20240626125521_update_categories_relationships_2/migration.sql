/*
  Warnings:

  - You are about to drop the `_CategoryToPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CategoryToPost` DROP FOREIGN KEY `_CategoryToPost_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CategoryToPost` DROP FOREIGN KEY `_CategoryToPost_B_fkey`;

-- DropIndex
DROP INDEX `Post_categoryId_fkey` ON `Post`;

-- DropTable
DROP TABLE `_CategoryToPost`;

-- CreateTable
CREATE TABLE `_PostToCategory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PostToCategory_AB_unique`(`A`, `B`),
    INDEX `_PostToCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PostToCategory` ADD CONSTRAINT `_PostToCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToCategory` ADD CONSTRAINT `_PostToCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
