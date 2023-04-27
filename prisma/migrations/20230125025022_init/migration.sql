/*
  Warnings:

  - You are about to drop the column `username` on the `auth_users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `auth_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `auth_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `auth_users_username_key` ON `auth_users`;

-- AlterTable
ALTER TABLE `auth_users` DROP COLUMN `username`,
    ADD COLUMN `name` VARCHAR(25) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `auth_users_email_key` ON `auth_users`(`email`);
