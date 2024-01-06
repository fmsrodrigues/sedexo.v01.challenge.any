CREATE TABLE `offers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quote` VARCHAR(191) NOT NULL,
    `carrier` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `deadline` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
