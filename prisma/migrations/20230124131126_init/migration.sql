/*
  Warnings:

  - You are about to drop the `auth_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_user_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `auth_user_role` DROP FOREIGN KEY `auth_user_role_auth_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `auth_user_role` DROP FOREIGN KEY `auth_user_role_auth_user_id_fkey`;

-- DropTable
DROP TABLE `auth_role`;

-- DropTable
DROP TABLE `auth_user`;

-- DropTable
DROP TABLE `auth_user_role`;

-- CreateTable
CREATE TABLE `auth_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(25) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `auth_users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `auth_roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_user_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `auth_user_id` INTEGER NOT NULL,
    `auth_role_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auth_user_roles` ADD CONSTRAINT `auth_user_roles_auth_user_id_fkey` FOREIGN KEY (`auth_user_id`) REFERENCES `auth_users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auth_user_roles` ADD CONSTRAINT `auth_user_roles_auth_role_id_fkey` FOREIGN KEY (`auth_role_id`) REFERENCES `auth_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
