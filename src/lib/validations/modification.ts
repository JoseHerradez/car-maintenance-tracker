import { z } from "zod";

export const modificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  cost: z.number().nonnegative().optional(),
  installedDate: z.date(),
  notes: z.string().optional(),
});

export type ModificationFormData = z.infer<typeof modificationSchema>;
