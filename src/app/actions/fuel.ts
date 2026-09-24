"use server";

import { db } from "@/db";
import { fuelLogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { verifyVehicleOwnership } from "@/lib/utils";
import { fuelLogSchema } from "@/lib/validations/fuel";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createFuelLog(vehicleId: string, formData: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = fuelLogSchema.parse(formData);

  await db.insert(fuelLogs).values({
    vehicleId,
    date: data.date,
    mileage: data.mileage,
    gallons: data.gallons.toString(), // Convert to string
    totalCost: data.totalCost.toString(), // Convert to string
  });

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function updateFuelLog(
  logId: string,
  vehicleId: string,
  formData: unknown,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = fuelLogSchema.parse(formData);

  await db
    .update(fuelLogs)
    .set({
      date: data.date,
      mileage: data.mileage,
      gallons: data.gallons.toString(), // Convert to string
      totalCost: data.totalCost.toString(), // Convert to string
    })
    .where(and(eq(fuelLogs.id, logId), eq(fuelLogs.vehicleId, vehicleId)));

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function deleteFuelLog(logId: string, vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  await db
    .delete(fuelLogs)
    .where(and(eq(fuelLogs.id, logId), eq(fuelLogs.vehicleId, vehicleId)));

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function getFuelLogs(vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  return db
    .select()
    .from(fuelLogs)
    .where(eq(fuelLogs.vehicleId, vehicleId))
    .orderBy(desc(fuelLogs.date));
}
