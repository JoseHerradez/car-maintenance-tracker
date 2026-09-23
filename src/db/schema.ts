import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  text,
  numeric,
} from "drizzle-orm/pg-core";

// 1. Vehicles Table
export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(), // Links to your Auth.js user
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  vin: varchar("vin", { length: 17 }),
  licensePlate: varchar("license_plate", { length: 20 }),
  currentMileage: integer("current_mileage").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Maintenance & Repairs Table
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(), // e.g., "Oil Change", "Brake Pads"
  date: timestamp("date").notNull(),
  mileage: integer("mileage").notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Fuel Logs Table
export const fuelLogs = pgTable("fuel_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  mileage: integer("mileage").notNull(),
  liters: numeric("liters", { precision: 10, scale: 2 }).notNull(),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
