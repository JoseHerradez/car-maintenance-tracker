import { z } from "zod";

export const fuelLogSchema = z.object({
  date: z.date(),
  mileage: z.number().int().nonnegative(),
  gallons: z.number().positive(),
  totalCost: z.number().positive(),
});

export type FuelLogFormData = z.infer<typeof fuelLogSchema>;
