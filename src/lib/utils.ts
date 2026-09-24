import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export { cn } from "cn";

export async function verifyVehicleOwnership(
  vehicleId: string,
  userId: string,
) {
  const vehicle = await db.query.vehicles.findFirst({
    where: and(eq(vehicles.id, vehicleId), eq(vehicles.userId, userId)),
  });
  if (!vehicle) throw new Error("Unauthorized");
}
