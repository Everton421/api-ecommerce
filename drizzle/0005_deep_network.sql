CREATE TABLE `products_imgs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`imgUrl` varchar(255) NOT NULL,
	CONSTRAINT `products_imgs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products_imgs` ADD CONSTRAINT `products_imgs_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;