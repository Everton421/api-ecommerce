ALTER TABLE `orders` MODIFY COLUMN `createdAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `updatedAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `type` enum('admin','client') NOT NULL DEFAULT 'client';--> statement-breakpoint
ALTER TABLE `products_imgs` ADD `createdAt` datetime DEFAULT '2001-01-01 02:00:00.000' NOT NULL;--> statement-breakpoint
ALTER TABLE `products_imgs` ADD `updatedAt` datetime DEFAULT '2001-01-01 02:00:00.000' NOT NULL;