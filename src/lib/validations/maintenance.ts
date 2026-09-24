import { z } from "zod";

export const maintenanceLogSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  date: z.date(),
  mileage: z.number().int().nonnegative(),
  cost: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export type MaintenanceLogFormData = z.infer<typeof maintenanceLogSchema>;
