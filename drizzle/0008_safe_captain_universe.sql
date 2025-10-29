ALTER TABLE `addres` MODIFY COLUMN `createdAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';--> statement-breakpoint
ALTER TABLE `addres` MODIFY COLUMN `updatedAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `createdAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updatedAt` datetime NOT NULL DEFAULT '2001-01-01 02:00:00.000';