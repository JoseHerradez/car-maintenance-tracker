"use server";

import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { auth } from "@/lib/auth";
import { vehicleSchema } from "@/lib/validations/vehicle";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createVehicle(formData: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const validatedData = vehicleSchema.parse(formData);

  await db.insert(vehicles).values({
    ...validatedData,
    userId: session.user.id,
  });

  revalidatePath("/dashboard/vehicles");
}

export async function updateVehicle(vehicleId: string, formData: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  const validatedData = vehicleSchema.parse(formData);

  // CRITICAL: Ensure the user owns the vehicle before updating
  await db
    .update(vehicles)
    .set(validatedData)
    .where(
      and(eq(vehicles.id, vehicleId), eq(vehicles.userId, session.user.id)),
    );

  revalidatePath("/dashboard/vehicles");
}

export async function deleteVehicle(vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  // CRITICAL: Ensure the user owns the vehicle before deleting
  await db
    .delete(vehicles)
    .where(
      and(eq(vehicles.id, vehicleId), eq(vehicles.userId, session.user.id)),
    );

  revalidatePath("/dashboard/vehicles");
}
