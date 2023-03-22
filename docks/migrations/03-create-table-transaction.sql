CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idAccount` int DEFAULT NULL,
  `value` decimal(9,0) DEFAULT NULL,
  `typeTransaction` varchar(255) DEFAULT NULL,
  `codeTransaction` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;