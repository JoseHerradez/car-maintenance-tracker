import { z } from "zod";

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  vin: z
    .string()
    .length(17, "VIN must be 17 characters")
    .nullish()
    .or(z.literal("")),
  licensePlate: z.string().nullish(),
  currentMileage: z.number().nonnegative().nullish(),
  purchasePrice: z
    .number()
    .int()
    .nonnegative("Price must be above 0")
    .nullish(),
  purchaseDate: z.date().nullish(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
