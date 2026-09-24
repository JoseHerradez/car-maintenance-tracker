"use server";

import { db } from "@/db";
import { reminders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { verifyVehicleOwnership } from "@/lib/utils";
import { reminderSchema } from "@/lib/validations/reminder";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createReminder(vehicleId: string, formData: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = reminderSchema.parse(formData);

  await db.insert(reminders).values({
    vehicleId,
    title: data.title,
    type: data.type,
    dueDate: data.dueDate ?? null,
    dueMileage: data.dueMileage ?? null,
    notes: data.notes ?? null,
    isCompleted: false,
  });

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function updateReminder(
  reminderId: string,
  vehicleId: string,
  formData: unknown,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = reminderSchema.parse(formData);

  await db
    .update(reminders)
    .set({
      title: data.title,
      type: data.type,
      dueDate: data.dueDate ?? null,
      dueMileage: data.dueMileage ?? null,
      notes: data.notes ?? null,
    })
    .where(
      and(eq(reminders.id, reminderId), eq(reminders.vehicleId, vehicleId)),
    );

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function deleteReminder(reminderId: string, vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  await db
    .delete(reminders)
    .where(
      and(eq(reminders.id, reminderId), eq(reminders.vehicleId, vehicleId)),
    );

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function toggleReminderComplete(
  reminderId: string,
  vehicleId: string,
  isCompleted: boolean,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  await db
    .update(reminders)
    .set({ isCompleted: !isCompleted })
    .where(
      and(eq(reminders.id, reminderId), eq(reminders.vehicleId, vehicleId)),
    );

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function getReminders(vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  return db
    .select()
    .from(reminders)
    .where(eq(reminders.vehicleId, vehicleId))
    .orderBy(desc(reminders.createdAt));
}
