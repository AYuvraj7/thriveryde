import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
  boolean,
  datetime,
} from "drizzle-orm/mysql-core";

/**
 * Core user table with support for three roles: customer, driver, delivery_partner
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  profileImage: text("profileImage"),
  role: mysqlEnum("role", ["customer", "driver", "delivery_partner", "admin"]).default("customer").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Driver-specific information
 */
export const drivers = mysqlTable("drivers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  licenseNumber: varchar("licenseNumber", { length: 50 }).notNull().unique(),
  licenseExpiry: datetime("licenseExpiry").notNull(),
  vehicleType: mysqlEnum("vehicleType", ["bike", "auto", "car"]).notNull(),
  vehicleNumber: varchar("vehicleNumber", { length: 50 }).notNull().unique(),
  vehicleModel: varchar("vehicleModel", { length: 100 }),
  isAvailable: boolean("isAvailable").default(false).notNull(),
  currentLatitude: decimal("currentLatitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("currentLongitude", { precision: 11, scale: 8 }),
  totalRides: int("totalRides").default(0).notNull(),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("5.00").notNull(),
  totalEarnings: decimal("totalEarnings", { precision: 12, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = typeof drivers.$inferInsert;

/**
 * Delivery partner-specific information
 */
export const deliveryPartners = mysqlTable("deliveryPartners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  licenseNumber: varchar("licenseNumber", { length: 50 }).notNull().unique(),
  licenseExpiry: datetime("licenseExpiry").notNull(),
  vehicleType: mysqlEnum("vehicleType", ["bike", "scooter", "car"]).notNull(),
  vehicleNumber: varchar("vehicleNumber", { length: 50 }).notNull().unique(),
  isAvailable: boolean("isAvailable").default(false).notNull(),
  currentLatitude: decimal("currentLatitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("currentLongitude", { precision: 11, scale: 8 }),
  totalDeliveries: int("totalDeliveries").default(0).notNull(),
  averageRating: decimal("averageRating", { precision: 3, scale: 2 }).default("5.00").notNull(),
  totalEarnings: decimal("totalEarnings", { precision: 12, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DeliveryPartner = typeof deliveryPartners.$inferSelect;
export type InsertDeliveryPartner = typeof deliveryPartners.$inferInsert;

/**
 * Ride bookings table
 */
export const rides = mysqlTable("rides", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  driverId: int("driverId"),
  pickupLatitude: decimal("pickupLatitude", { precision: 10, scale: 8 }).notNull(),
  pickupLongitude: decimal("pickupLongitude", { precision: 11, scale: 8 }).notNull(),
  pickupAddress: text("pickupAddress").notNull(),
  dropLatitude: decimal("dropLatitude", { precision: 10, scale: 8 }).notNull(),
  dropLongitude: decimal("dropLongitude", { precision: 11, scale: 8 }).notNull(),
  dropAddress: text("dropAddress").notNull(),
  vehicleType: mysqlEnum("vehicleType", ["bike", "auto", "car"]).notNull(),
  estimatedFare: decimal("estimatedFare", { precision: 10, scale: 2 }).notNull(),
  finalFare: decimal("finalFare", { precision: 10, scale: 2 }),
  estimatedDuration: int("estimatedDuration"), // in minutes
  status: mysqlEnum("status", ["requested", "accepted", "in_progress", "completed", "cancelled"]).default("requested").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed"]).default("pending").notNull(),
  specialRequests: text("specialRequests"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Ride = typeof rides.$inferSelect;
export type InsertRide = typeof rides.$inferInsert;

/**
 * Real-time ride tracking
 */
export const rideTracking = mysqlTable("rideTracking", {
  id: int("id").autoincrement().primaryKey(),
  rideId: int("rideId").notNull(),
  driverLatitude: decimal("driverLatitude", { precision: 10, scale: 8 }).notNull(),
  driverLongitude: decimal("driverLongitude", { precision: 11, scale: 8 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RideTracking = typeof rideTracking.$inferSelect;
export type InsertRideTracking = typeof rideTracking.$inferInsert;

/**
 * Delivery orders table
 */
export const deliveryOrders = mysqlTable("deliveryOrders", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  deliveryPartnerId: int("deliveryPartnerId"),
  deliveryLatitude: decimal("deliveryLatitude", { precision: 10, scale: 8 }).notNull(),
  deliveryLongitude: decimal("deliveryLongitude", { precision: 11, scale: 8 }).notNull(),
  deliveryAddress: text("deliveryAddress").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("deliveryFee", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "in_transit", "delivered", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed"]).default("pending").notNull(),
  specialInstructions: text("specialInstructions"),
  estimatedDeliveryTime: int("estimatedDeliveryTime"), // in minutes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deliveredAt: timestamp("deliveredAt"),
});

export type DeliveryOrder = typeof deliveryOrders.$inferSelect;
export type InsertDeliveryOrder = typeof deliveryOrders.$inferInsert;

/**
 * Shopping cart items for delivery orders
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  itemName: varchar("itemName", { length: 255 }).notNull(),
  itemCategory: varchar("itemCategory", { length: 100 }).notNull(),
  quantity: int("quantity").notNull(),
  pricePerUnit: decimal("pricePerUnit", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Delivery order items (items in completed orders)
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  itemName: varchar("itemName", { length: 255 }).notNull(),
  itemCategory: varchar("itemCategory", { length: 100 }).notNull(),
  quantity: int("quantity").notNull(),
  pricePerUnit: decimal("pricePerUnit", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Real-time delivery tracking
 */
export const deliveryTracking = mysqlTable("deliveryTracking", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  partnerLatitude: decimal("partnerLatitude", { precision: 10, scale: 8 }).notNull(),
  partnerLongitude: decimal("partnerLongitude", { precision: 11, scale: 8 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeliveryTracking = typeof deliveryTracking.$inferSelect;
export type InsertDeliveryTracking = typeof deliveryTracking.$inferInsert;

/**
 * Payments table for both rides and deliveries
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serviceType: mysqlEnum("serviceType", ["ride", "delivery"]).notNull(),
  rideId: int("rideId"),
  orderId: int("orderId"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["card", "upi", "wallet", "cash"]).notNull(),
  transactionId: varchar("transactionId", { length: 100 }).unique(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Ratings and reviews
 */
export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  ratedUserId: int("ratedUserId").notNull(),
  serviceType: mysqlEnum("serviceType", ["ride", "delivery"]).notNull(),
  rideId: int("rideId"),
  orderId: int("orderId"),
  rating: int("rating").notNull(), // 1-5
  review: text("review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;

/**
 * Order status history for tracking
 */
export const orderStatusHistory = mysqlTable("orderStatusHistory", {
  id: int("id").autoincrement().primaryKey(),
  serviceType: mysqlEnum("serviceType", ["ride", "delivery"]).notNull(),
  rideId: int("rideId"),
  orderId: int("orderId"),
  status: varchar("status", { length: 50 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type InsertOrderStatusHistory = typeof orderStatusHistory.$inferInsert;
