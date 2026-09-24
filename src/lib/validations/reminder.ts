import { z } from "zod";

export const reminderSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["time", "mileage"]),
    dueDate: z.date().nullish(),
    dueMileage: z.number().int().positive().nullish(),
    notes: z.string().nullish(),
  })
  .refine(
    (data) => {
      if (data.type === "time") return !!data.dueDate;
      return true;
    },
    {
      message: "Due date is required for time-based reminders",
      path: ["dueDate"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "mileage") return !!data.dueMileage;
      return true;
    },
    {
      message: "Due mileage is required for mileage-based reminders",
      path: ["dueMileage"],
    },
  );

export type ReminderFormData = z.infer<typeof reminderSchema>;
