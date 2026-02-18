import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  getUserById,
  getDriverByUserId,
  getDeliveryPartnerByUserId,
  getUserRides,
  getUserDeliveryOrders,
  getUserCart,
  getPaymentsByUser,
} from "./db";
import { z } from "zod";
import { drivers, deliveryPartners, rides, deliveryOrders, cartItems, payments, users, orderItems } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User profile management
  user: router({
    profile: protectedProcedure.query(async ({ ctx }) => {
      return await getUserById(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          phone: z.string().optional(),
          profileImage: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(users)
          .set({
            name: input.name,
            phone: input.phone,
            profileImage: input.profileImage,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),

    setupDriver: protectedProcedure
      .input(
        z.object({
          licenseNumber: z.string(),
          licenseExpiry: z.date(),
          vehicleType: z.enum(["bike", "auto", "car"]),
          vehicleNumber: z.string(),
          vehicleModel: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if driver already exists
        const existing = await getDriverByUserId(ctx.user.id);
        if (existing) {
          throw new Error("Driver profile already exists");
        }

        await db.insert(drivers).values({
          userId: ctx.user.id,
          licenseNumber: input.licenseNumber,
          licenseExpiry: input.licenseExpiry,
          vehicleType: input.vehicleType,
          vehicleNumber: input.vehicleNumber,
          vehicleModel: input.vehicleModel,
        });

        // Update user role
        await db
          .update(users)
          .set({ role: "driver" })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),

    setupDeliveryPartner: protectedProcedure
      .input(
        z.object({
          licenseNumber: z.string(),
          licenseExpiry: z.date(),
          vehicleType: z.enum(["bike", "scooter", "car"]),
          vehicleNumber: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Check if delivery partner already exists
        const existing = await getDeliveryPartnerByUserId(ctx.user.id);
        if (existing) {
          throw new Error("Delivery partner profile already exists");
        }

        await db.insert(deliveryPartners).values({
          userId: ctx.user.id,
          licenseNumber: input.licenseNumber,
          licenseExpiry: input.licenseExpiry,
          vehicleType: input.vehicleType,
          vehicleNumber: input.vehicleNumber,
        });

        // Update user role
        await db
          .update(users)
          .set({ role: "delivery_partner" })
          .where(eq(users.id, ctx.user.id));

        return { success: true };
      }),
  }),

  // Ride booking procedures
  rides: router({
    createRide: protectedProcedure
      .input(
        z.object({
          pickupLatitude: z.number(),
          pickupLongitude: z.number(),
          pickupAddress: z.string(),
          dropLatitude: z.number(),
          dropLongitude: z.number(),
          dropAddress: z.string(),
          vehicleType: z.enum(["bike", "auto", "car"]),
          estimatedFare: z.number(),
          specialRequests: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(rides).values({
          customerId: ctx.user.id,
          pickupLatitude: input.pickupLatitude.toString() as any,
          pickupLongitude: input.pickupLongitude.toString() as any,
          pickupAddress: input.pickupAddress,
          dropLatitude: input.dropLatitude.toString() as any,
          dropLongitude: input.dropLongitude.toString() as any,
          dropAddress: input.dropAddress,
          vehicleType: input.vehicleType,
          estimatedFare: input.estimatedFare.toString() as any,
          specialRequests: input.specialRequests,
        });

        return { rideId: result[0].insertId, success: true };
      }),

    getRideHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getUserRides(ctx.user.id);
    }),

    getRideDetails: protectedProcedure
      .input(z.object({ rideId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(rides)
          .where(eq(rides.id, input.rideId))
          .limit(1);

        return result.length > 0 ? result[0] : null;
      }),
  }),

  // Delivery order procedures
  delivery: router({
    createOrder: protectedProcedure
      .input(
        z.object({
          deliveryLatitude: z.number(),
          deliveryLongitude: z.number(),
          deliveryAddress: z.string(),
          items: z.array(
            z.object({
              itemName: z.string(),
              itemCategory: z.string(),
              quantity: z.number(),
              pricePerUnit: z.number(),
            })
          ),
          deliveryFee: z.number(),
          specialInstructions: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const totalAmount = input.items.reduce(
          (sum, item) => sum + item.quantity * item.pricePerUnit,
          0
        );

        const orderResult = await db.insert(deliveryOrders).values({
          customerId: ctx.user.id,
          deliveryLatitude: input.deliveryLatitude.toString() as any,
          deliveryLongitude: input.deliveryLongitude.toString() as any,
          deliveryAddress: input.deliveryAddress,
          totalAmount: totalAmount.toString() as any,
          deliveryFee: input.deliveryFee.toString() as any,
          specialInstructions: input.specialInstructions,
        });

        // Add items to order
        const orderId = orderResult[0].insertId;
        for (const item of input.items) {
          await db.insert(orderItems).values({
            orderId: orderId,
            itemName: item.itemName,
            itemCategory: item.itemCategory,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit.toString() as any,
            totalPrice: (item.quantity * item.pricePerUnit).toString() as any,
          });
        }

        return { orderId, success: true };
      }),

    getOrderHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getUserDeliveryOrders(ctx.user.id);
    }),

    getOrderDetails: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const result = await db
          .select()
          .from(deliveryOrders)
          .where(eq(deliveryOrders.id, input.orderId))
          .limit(1);

        return result.length > 0 ? result[0] : null;
      }),
  }),

  // Cart management
  cart: router({
    getCart: protectedProcedure.query(async ({ ctx }) => {
      return await getUserCart(ctx.user.id);
    }),

    addItem: protectedProcedure
      .input(
        z.object({
          itemName: z.string(),
          itemCategory: z.string(),
          quantity: z.number(),
          pricePerUnit: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const totalPrice = input.quantity * input.pricePerUnit;

        await db.insert(cartItems).values({
          customerId: ctx.user.id,
          itemName: input.itemName,
          itemCategory: input.itemCategory,
          quantity: input.quantity,
          pricePerUnit: input.pricePerUnit.toString() as any,
          totalPrice: totalPrice.toString() as any,
        });

        return { success: true };
      }),

    removeItem: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .delete(cartItems)
          .where(eq(cartItems.id, input.itemId));

        return { success: true };
      }),

    clearCart: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(cartItems)
        .where(eq(cartItems.customerId, ctx.user.id));

      return { success: true };
    }),
  }),

  // Payment procedures
  payments: router({
    getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getPaymentsByUser(ctx.user.id);
    }),

    createPayment: protectedProcedure
      .input(
        z.object({
          serviceType: z.enum(["ride", "delivery"]),
          rideId: z.number().optional(),
          orderId: z.number().optional(),
          amount: z.number(),
          paymentMethod: z.enum(["card", "upi", "wallet", "cash"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(payments).values({
          userId: ctx.user.id,
          serviceType: input.serviceType,
          rideId: input.rideId || undefined,
          orderId: input.orderId || undefined,
          amount: input.amount.toString() as any,
          paymentMethod: input.paymentMethod,
          status: "pending",
        });

        return { paymentId: result[0].insertId, success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
