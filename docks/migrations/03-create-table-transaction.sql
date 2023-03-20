CREATE TABLE IF NOT EXISTS `transactions` 
(
    `id` INTEGER NOT NULL auto_increment , 
    `idAccount` INTEGER, 
    `value` DECIMAL(9), 
    `typeTransaction` VARCHAR(255), 
    `codeTransaction` VARCHAR(255), 
    `createdAt` DATETIME NOT NULL, 
    `updatedAt` DATETIME NOT NULL, 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;