"use server";

import { db } from "@/db";
import { maintenanceLogs } from "@/db/schema";
import { auth } from "@/lib/auth";
import { verifyVehicleOwnership } from "@/lib/utils";
import { maintenanceLogSchema } from "@/lib/validations/maintenance";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createMaintenanceLog(
  vehicleId: string,
  formData: unknown,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = maintenanceLogSchema.parse(formData);

  await db.insert(maintenanceLogs).values({
    vehicleId,
    serviceType: data.serviceType,
    date: data.date,
    mileage: data.mileage,
    cost: data.cost?.toString() ?? null, // Convert to string
    notes: data.notes ?? null,
  });

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function updateMaintenanceLog(
  logId: string,
  vehicleId: string,
  formData: unknown,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = maintenanceLogSchema.parse(formData);

  await db
    .update(maintenanceLogs)
    .set({
      serviceType: data.serviceType,
      date: data.date,
      mileage: data.mileage,
      cost: data.cost?.toString() ?? null, // Convert to string
      notes: data.notes ?? null,
    })
    .where(
      and(
        eq(maintenanceLogs.id, logId),
        eq(maintenanceLogs.vehicleId, vehicleId),
      ),
    );

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function deleteMaintenanceLog(logId: string, vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  await db
    .delete(maintenanceLogs)
    .where(
      and(
        eq(maintenanceLogs.id, logId),
        eq(maintenanceLogs.vehicleId, vehicleId),
      ),
    );

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function getMaintenanceLogs(vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  return db
    .select()
    .from(maintenanceLogs)
    .where(eq(maintenanceLogs.vehicleId, vehicleId))
    .orderBy(desc(maintenanceLogs.date));
}
