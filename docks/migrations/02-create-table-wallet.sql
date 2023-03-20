CREATE TABLE IF NOT EXISTS `wallets` (
    `id` BIGINT auto_increment , 
    `idAccount` INTEGER, 
    `value` DECIMAL(15), 
    `createdAt` DATETIME NOT NULL, 
    `updatedAt` DATETIME NOT NULL, 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;