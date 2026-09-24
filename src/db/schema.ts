import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// --- BETTER-AUTH TABLES ---

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 255 }),
  idToken: text("id_token"),
  password: varchar("password", { length: 255 }), // For email/password auth
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verifications = pgTable("verifications", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- APP TABLES ---

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  vin: varchar("vin", { length: 17 }),
  licensePlate: varchar("license_plate", { length: 20 }),
  currentMileage: integer("current_mileage").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  purchasePrice: integer("purchase_price"),
  purchaseDate: timestamp("purchase_date"),
});

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  mileage: integer("mileage").notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fuelLogs = pgTable("fuel_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  mileage: integer("mileage").notNull(),
  gallons: numeric("gallons", { precision: 10, scale: 2 }).notNull(),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modifications = pgTable("modifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // e.g., "Performance", "Aesthetic", "Interior"
  brand: varchar("brand", { length: 100 }),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  installedDate: timestamp("installed_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const maintenanceFiles = pgTable("maintenance_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  maintenanceLogId: uuid("maintenance_log_id")
    .references(() => maintenanceLogs.id, { onDelete: "cascade" })
    .notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fuelFiles = pgTable("fuel_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  fuelLogId: uuid("fuel_log_id")
    .references(() => fuelLogs.id, { onDelete: "cascade" })
    .notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const modificationFiles = pgTable("modification_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  modificationId: uuid("modification_id")
    .references(() => modifications.id, { onDelete: "cascade" })
    .notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id")
    .references(() => vehicles.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'time' or 'mileage'
  dueDate: timestamp("due_date"),
  dueMileage: integer("due_mileage"),
  notes: text("notes"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//  --- RELATIONS ---

export const maintenanceLogsRelations = relations(
  maintenanceLogs,
  ({ many, one }) => ({
    vehicle: one(vehicles, {
      fields: [maintenanceLogs.vehicleId],
      references: [vehicles.id],
    }),
    files: many(maintenanceFiles),
  }),
);

export const maintenanceFilesRelations = relations(
  maintenanceFiles,
  ({ one }) => ({
    maintenanceLog: one(maintenanceLogs, {
      fields: [maintenanceFiles.maintenanceLogId],
      references: [maintenanceLogs.id],
    }),
  }),
);

export const fuelLogsRelations = relations(fuelLogs, ({ many, one }) => ({
  vehicle: one(vehicles, {
    fields: [fuelLogs.vehicleId],
    references: [vehicles.id],
  }),
  files: many(fuelFiles),
}));

export const fuelFilesRelations = relations(fuelFiles, ({ one }) => ({
  fuelLog: one(fuelLogs, {
    fields: [fuelFiles.fuelLogId],
    references: [fuelLogs.id],
  }),
}));

export const modificationsRelations = relations(
  modifications,
  ({ many, one }) => ({
    vehicle: one(vehicles, {
      fields: [modifications.vehicleId],
      references: [vehicles.id],
    }),
    files: many(modificationFiles),
  }),
);

export const modificationFilesRelations = relations(
  modificationFiles,
  ({ one }) => ({
    modification: one(modifications, {
      fields: [modificationFiles.modificationId],
      references: [modifications.id],
    }),
  }),
);

export const remindersRelations = relations(reminders, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [reminders.vehicleId],
    references: [vehicles.id],
  }),
}));
