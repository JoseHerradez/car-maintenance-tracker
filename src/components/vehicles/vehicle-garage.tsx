import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddVehicleDialog } from "@/components/vehicles/add-vehicle-dialog";
import { DeleteVehicleButton } from "@/components/vehicles/delete-vehicle-button";
import { EditVehicleDialog } from "@/components/vehicles/edit-vehicle-dialog";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Car } from "lucide-react";
import Link from "next/link";

interface VehicleGarageProps {
  userId: string;
}

export async function VehicleGarage({ userId }: VehicleGarageProps) {
  const userVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, userId));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Garage</h2>
        <AddVehicleDialog />
      </div>

      {userVehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No vehicles in your garage yet.
            </p>
            <AddVehicleDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="hover:shadow-lg transition-shadow"
            >
              <Link
                href={`/dashboard/vehicles/${vehicle.id}`}
                className="block"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Plate: {vehicle.licensePlate}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    VIN: {vehicle.vin || "N/A"}
                  </p>
                  {vehicle.purchasePrice && (
                    <p className="text-sm text-muted-foreground">
                      Purchase Price: ${vehicle.purchasePrice.toLocaleString()}
                    </p>
                  )}
                  {vehicle.purchaseDate && (
                    <p className="text-sm text-muted-foreground">
                      Purchase Date:{" "}
                      {new Date(vehicle.purchaseDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Link>

              <CardContent className="pt-0">
                <div className="flex justify-end gap-2 border-t pt-4">
                  <EditVehicleDialog vehicle={vehicle} />
                  <DeleteVehicleButton
                    vehicleId={vehicle.id}
                    vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
