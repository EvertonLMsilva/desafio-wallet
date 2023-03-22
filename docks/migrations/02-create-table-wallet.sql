walletsCREATE TABLE `wallets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `idAccount` int DEFAULT NULL,
  `value` decimal(15,0) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;