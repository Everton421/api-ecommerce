CREATE TABLE `addres` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	`zipCode` varchar(255) NOT NULL,
	`road` varchar(255) NOT NULL,
	`number` int NOT NULL,
	`neighborhood` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `addres_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`price` decimal(10,2) NOT NULL DEFAULT '0.00',
	`offerPrice` decimal(10,2) NOT NULL DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`total` decimal(10,2) NOT NULL DEFAULT '0.00',
	`status` enum('canceled','served','erro','open'),
	`addres` int NOT NULL,
	`payment` enum('pending','authorized'),
	`createdAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000',
	`updatedAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000',
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`description` varchar(255),
	`price` decimal(10,2) NOT NULL DEFAULT '0.00',
	`offerPrice` decimal(10,2) NOT NULL DEFAULT '0.00',
	`category` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000',
	`updatedAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000',
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products_imgs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`typeImg` enum('catalog','especification') NOT NULL DEFAULT 'catalog',
	`imgUrl` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000',
	`updatedAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000',
	CONSTRAINT `products_imgs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`imageUrl` varchar(255),
	`phoneNumber` varchar(255) NOT NULL,
	`type` enum('admin','client') NOT NULL DEFAULT 'client',
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `addres` ADD CONSTRAINT `addres_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `items_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_addres_addres_id_fk` FOREIGN KEY (`addres`) REFERENCES `addres`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products_imgs` ADD CONSTRAINT `products_imgs_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;