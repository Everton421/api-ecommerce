ALTER TABLE `products` MODIFY COLUMN `createdAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `updatedAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';--> statement-breakpoint
ALTER TABLE `users` ADD `type` enum('admin','client') DEFAULT 'client';