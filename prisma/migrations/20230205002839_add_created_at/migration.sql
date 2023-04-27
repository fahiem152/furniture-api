/*
  Warnings:

  - You are about to drop the column `date` on the `income_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `income_products` DROP COLUMN `date`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
