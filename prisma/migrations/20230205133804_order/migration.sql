-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `product_price` INTEGER NOT NULL,
    `total_price` INTEGER NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_addres` VARCHAR(100) NOT NULL,
    `customer_phone` VARCHAR(14) NOT NULL,
    `address_details` TEXT NOT NULL,
    `delivery_type` ENUM('TakeAway', 'Delivery') NOT NULL DEFAULT 'Delivery',
    `delivery_status` ENUM('Pending', 'Delivered') NOT NULL DEFAULT 'Pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
