CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`itemCategory` varchar(100) NOT NULL,
	`quantity` int NOT NULL,
	`pricePerUnit` decimal(10,2) NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliveryOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`deliveryPartnerId` int,
	`deliveryLatitude` decimal(10,8) NOT NULL,
	`deliveryLongitude` decimal(11,8) NOT NULL,
	`deliveryAddress` text NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`deliveryFee` decimal(10,2) NOT NULL,
	`status` enum('pending','accepted','in_transit','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`paymentStatus` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`specialInstructions` text,
	`estimatedDeliveryTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deliveredAt` timestamp,
	CONSTRAINT `deliveryOrders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliveryPartners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`licenseNumber` varchar(50) NOT NULL,
	`licenseExpiry` datetime NOT NULL,
	`vehicleType` enum('bike','scooter','car') NOT NULL,
	`vehicleNumber` varchar(50) NOT NULL,
	`isAvailable` boolean NOT NULL DEFAULT false,
	`currentLatitude` decimal(10,8),
	`currentLongitude` decimal(11,8),
	`totalDeliveries` int NOT NULL DEFAULT 0,
	`averageRating` decimal(3,2) NOT NULL DEFAULT '5.00',
	`totalEarnings` decimal(12,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deliveryPartners_id` PRIMARY KEY(`id`),
	CONSTRAINT `deliveryPartners_licenseNumber_unique` UNIQUE(`licenseNumber`),
	CONSTRAINT `deliveryPartners_vehicleNumber_unique` UNIQUE(`vehicleNumber`)
);
--> statement-breakpoint
CREATE TABLE `deliveryTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`partnerLatitude` decimal(10,8) NOT NULL,
	`partnerLongitude` decimal(11,8) NOT NULL,
	`status` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deliveryTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`licenseNumber` varchar(50) NOT NULL,
	`licenseExpiry` datetime NOT NULL,
	`vehicleType` enum('bike','auto','car') NOT NULL,
	`vehicleNumber` varchar(50) NOT NULL,
	`vehicleModel` varchar(100),
	`isAvailable` boolean NOT NULL DEFAULT false,
	`currentLatitude` decimal(10,8),
	`currentLongitude` decimal(11,8),
	`totalRides` int NOT NULL DEFAULT 0,
	`averageRating` decimal(3,2) NOT NULL DEFAULT '5.00',
	`totalEarnings` decimal(12,2) NOT NULL DEFAULT '0.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `drivers_id` PRIMARY KEY(`id`),
	CONSTRAINT `drivers_licenseNumber_unique` UNIQUE(`licenseNumber`),
	CONSTRAINT `drivers_vehicleNumber_unique` UNIQUE(`vehicleNumber`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`itemCategory` varchar(100) NOT NULL,
	`quantity` int NOT NULL,
	`pricePerUnit` decimal(10,2) NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderStatusHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceType` enum('ride','delivery') NOT NULL,
	`rideId` int,
	`orderId` int,
	`status` varchar(50) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderStatusHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`serviceType` enum('ride','delivery') NOT NULL,
	`rideId` int,
	`orderId` int,
	`amount` decimal(10,2) NOT NULL,
	`paymentMethod` enum('card','upi','wallet','cash') NOT NULL,
	`transactionId` varchar(100),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ratedUserId` int NOT NULL,
	`serviceType` enum('ride','delivery') NOT NULL,
	`rideId` int,
	`orderId` int,
	`rating` int NOT NULL,
	`review` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rideTracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rideId` int NOT NULL,
	`driverLatitude` decimal(10,8) NOT NULL,
	`driverLongitude` decimal(11,8) NOT NULL,
	`status` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rideTracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`driverId` int,
	`pickupLatitude` decimal(10,8) NOT NULL,
	`pickupLongitude` decimal(11,8) NOT NULL,
	`pickupAddress` text NOT NULL,
	`dropLatitude` decimal(10,8) NOT NULL,
	`dropLongitude` decimal(11,8) NOT NULL,
	`dropAddress` text NOT NULL,
	`vehicleType` enum('bike','auto','car') NOT NULL,
	`estimatedFare` decimal(10,2) NOT NULL,
	`finalFare` decimal(10,2),
	`estimatedDuration` int,
	`status` enum('requested','accepted','in_progress','completed','cancelled') NOT NULL DEFAULT 'requested',
	`paymentStatus` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`specialRequests` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `rides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('customer','driver','delivery_partner','admin') NOT NULL DEFAULT 'customer';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `profileImage` text;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `loginMethod`;