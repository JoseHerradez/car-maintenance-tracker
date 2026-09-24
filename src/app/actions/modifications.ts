"use server";

import { db } from "@/db";
import { modifications } from "@/db/schema";
import { auth } from "@/lib/auth";
import { verifyVehicleOwnership } from "@/lib/utils";
import { modificationSchema } from "@/lib/validations/modification";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createModification(vehicleId: string, formData: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = modificationSchema.parse(formData);

  await db.insert(modifications).values({
    vehicleId,
    name: data.name,
    category: data.category,
    brand: data.brand ?? null,
    cost: data.cost?.toString() ?? null, // Convert to string
    installedDate: data.installedDate,
    notes: data.notes ?? null,
  });

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function updateModification(
  modId: string,
  vehicleId: string,
  formData: unknown,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);
  const data = modificationSchema.parse(formData);

  await db
    .update(modifications)
    .set({
      name: data.name,
      category: data.category,
      brand: data.brand ?? null,
      cost: data.cost?.toString() ?? null, // Convert to string
      installedDate: data.installedDate,
      notes: data.notes ?? null,
    })
    .where(
      and(eq(modifications.id, modId), eq(modifications.vehicleId, vehicleId)),
    );

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function deleteModification(modId: string, vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  await db
    .delete(modifications)
    .where(
      and(eq(modifications.id, modId), eq(modifications.vehicleId, vehicleId)),
    );

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function getModifications(vehicleId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyVehicleOwnership(vehicleId, session.user.id);

  return db
    .select()
    .from(modifications)
    .where(eq(modifications.vehicleId, vehicleId))
    .orderBy(desc(modifications.installedDate));
}
