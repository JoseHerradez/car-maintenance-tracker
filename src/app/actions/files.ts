"use server";

import { db } from "@/db";
import {
  fuelFiles,
  fuelLogs,
  maintenanceFiles,
  maintenanceLogs,
  modificationFiles,
  modifications,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { del, put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

async function verifyMaintenanceOwnership(logId: string, userId: string) {
  const log = await db.query.maintenanceLogs.findFirst({
    where: eq(maintenanceLogs.id, logId),
    with: {
      vehicle: {
        columns: { userId: true },
      },
    },
  });
  if (!log || log.vehicle.userId !== userId) throw new Error("Unauthorized");
}

async function verifyFuelOwnership(logId: string, userId: string) {
  const log = await db.query.fuelLogs.findFirst({
    where: eq(fuelLogs.id, logId),
    with: {
      vehicle: {
        columns: { userId: true },
      },
    },
  });
  if (!log || log.vehicle.userId !== userId) throw new Error("Unauthorized");
}

async function verifyModificationOwnership(modId: string, userId: string) {
  const mod = await db.query.modifications.findFirst({
    where: eq(modifications.id, modId),
    with: {
      vehicle: {
        columns: { userId: true },
      },
    },
  });
  if (!mod || mod.vehicle.userId !== userId) throw new Error("Unauthorized");
}

export async function uploadMaintenanceFile(
  logId: string,
  vehicleId: string,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyMaintenanceOwnership(logId, session.user.id);

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const blob = await put(file.name, file, {
    access: "public",
  });

  await db.insert(maintenanceFiles).values({
    maintenanceLogId: logId,
    fileName: file.name,
    fileUrl: blob.url,
    fileType: file.type,
    fileSize: file.size,
  });

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function uploadFuelFile(
  logId: string,
  vehicleId: string,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyFuelOwnership(logId, session.user.id);

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const blob = await put(file.name, file, {
    access: "public",
  });

  await db.insert(fuelFiles).values({
    fuelLogId: logId,
    fileName: file.name,
    fileUrl: blob.url,
    fileType: file.type,
    fileSize: file.size,
  });

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function uploadModificationFile(
  modId: string,
  vehicleId: string,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  await verifyModificationOwnership(modId, session.user.id);

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const blob = await put(file.name, file, {
    access: "public",
  });

  await db.insert(modificationFiles).values({
    modificationId: modId,
    fileName: file.name,
    fileUrl: blob.url,
    fileType: file.type,
    fileSize: file.size,
  });

  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}

export async function deleteFile(
  fileId: string,
  type: "maintenance" | "fuel" | "modification",
  vehicleId: string,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");

  let file;
  let fileUrl: string;

  if (type === "maintenance") {
    file = await db.query.maintenanceFiles.findFirst({
      where: eq(maintenanceFiles.id, fileId),
    });
    if (!file) throw new Error("File not found");
    fileUrl = file.fileUrl;
    await db.delete(maintenanceFiles).where(eq(maintenanceFiles.id, fileId));
  } else if (type === "fuel") {
    file = await db.query.fuelFiles.findFirst({
      where: eq(fuelFiles.id, fileId),
    });
    if (!file) throw new Error("File not found");
    fileUrl = file.fileUrl;
    await db.delete(fuelFiles).where(eq(fuelFiles.id, fileId));
  } else {
    file = await db.query.modificationFiles.findFirst({
      where: eq(modificationFiles.id, fileId),
    });
    if (!file) throw new Error("File not found");
    fileUrl = file.fileUrl;
    await db.delete(modificationFiles).where(eq(modificationFiles.id, fileId));
  }

  await del(fileUrl);
  revalidatePath(`/dashboard/vehicles/${vehicleId}`);
}
