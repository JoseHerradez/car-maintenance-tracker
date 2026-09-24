import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddFuelDialog } from "@/components/vehicles/add-fuel-dialog";
import { AddMaintenanceDialog } from "@/components/vehicles/add-maintenance-dialog";
import { AddModificationDialog } from "@/components/vehicles/add-modification-dialog";
import { DeleteFuelButton } from "@/components/vehicles/delete-fuel-button";
import { DeleteMaintenanceButton } from "@/components/vehicles/delete-maintenance-button";
import { DeleteModificationButton } from "@/components/vehicles/delete-modification-button";
import { EditFuelDialog } from "@/components/vehicles/edit-fuel-dialog";
import { EditMaintenanceDialog } from "@/components/vehicles/edit-maintenance-dialog";
import { EditModificationDialog } from "@/components/vehicles/edit-modification-dialog";
import { FileList } from "@/components/vehicles/file-list";
import { FileUpload } from "@/components/vehicles/file-upload";
import { db } from "@/db";
import {
  fuelFiles,
  fuelLogs,
  maintenanceFiles,
  maintenanceLogs,
  modificationFiles,
  modifications,
  vehicles,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft, Fuel, Wrench, WrenchIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/");

  const vehicle = await db.query.vehicles.findFirst({
    where: and(eq(vehicles.id, id), eq(vehicles.userId, session.user.id)),
  });

  if (!vehicle) redirect("/dashboard");

  const [maintenance, fuel, mods, mFiles, fFiles, modFiles] = await Promise.all(
    [
      db
        .select()
        .from(maintenanceLogs)
        .where(eq(maintenanceLogs.vehicleId, id))
        .orderBy(desc(maintenanceLogs.date)),
      db
        .select()
        .from(fuelLogs)
        .where(eq(fuelLogs.vehicleId, id))
        .orderBy(desc(fuelLogs.date)),
      db
        .select()
        .from(modifications)
        .where(eq(modifications.vehicleId, id))
        .orderBy(desc(modifications.installedDate)),
      db.select().from(maintenanceFiles),
      db.select().from(fuelFiles),
      db.select().from(modificationFiles),
    ],
  );

  const totalMaintenanceCost = maintenance.reduce(
    (sum, log) => sum + parseFloat(log.cost || "0"),
    0,
  );
  const totalFuelCost = fuel.reduce(
    (sum, log) => sum + parseFloat(log.totalCost),
    0,
  );
  const totalModCost = mods.reduce(
    (sum, mod) => sum + parseFloat(mod.cost || "0"),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Garage
          </Button>
        </Link>

        <div>
          <h1 className="text-3xl font-bold">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-muted-foreground">
            {vehicle.licensePlate} • {vehicle.vin || "No VIN"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Maintenance Spent
              </CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalMaintenanceCost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {maintenance.length} services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Spent</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalFuelCost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {fuel.length} fill-ups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mods Spent</CardTitle>
              <WrenchIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalModCost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {mods.length} modifications
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="maintenance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="fuel">Fuel</TabsTrigger>
            <TabsTrigger value="mods">Modifications</TabsTrigger>
          </TabsList>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="flex justify-end">
              <AddMaintenanceDialog vehicleId={id} />
            </div>
            {maintenance.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No maintenance logs yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {maintenance.map((log) => {
                  const logFiles = mFiles.filter(
                    (f) => f.maintenanceLogId === log.id,
                  );
                  return (
                    <Card key={log.id}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold">{log.serviceType}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(log.date, "MMM d, yyyy")} •{" "}
                              {log.mileage.toLocaleString()} mi
                            </p>
                            {log.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {log.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-start gap-2">
                            {log.cost && (
                              <p className="font-semibold mr-4">
                                ${parseFloat(log.cost).toFixed(2)}
                              </p>
                            )}
                            <EditMaintenanceDialog
                              vehicleId={id}
                              log={{
                                id: log.id,
                                serviceType: log.serviceType,
                                date: log.date,
                                mileage: log.mileage,
                                cost: log.cost
                                  ? parseFloat(log.cost)
                                  : undefined,
                                notes: log.notes || undefined,
                              }}
                            />
                            <DeleteMaintenanceButton
                              logId={log.id}
                              vehicleId={id}
                              serviceType={log.serviceType}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <FileUpload
                            logId={log.id}
                            vehicleId={id}
                            type="maintenance"
                          />
                        </div>
                        <FileList
                          files={logFiles}
                          vehicleId={id}
                          type="maintenance"
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fuel" className="space-y-4">
            <div className="flex justify-end">
              <AddFuelDialog vehicleId={id} />
            </div>
            {fuel.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No fuel logs yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {fuel.map((log) => {
                  const logFiles = fFiles.filter((f) => f.fuelLogId === log.id);
                  return (
                    <Card key={log.id}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold">
                              {log.mileage.toLocaleString()} miles
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(log.date, "MMM d, yyyy")} • {log.gallons}{" "}
                              gal
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <p className="font-semibold mr-4">
                              ${parseFloat(log.totalCost).toFixed(2)}
                            </p>
                            <EditFuelDialog
                              vehicleId={id}
                              log={{
                                id: log.id,
                                date: log.date,
                                mileage: log.mileage,
                                gallons: parseFloat(log.gallons),
                                totalCost: parseFloat(log.totalCost),
                              }}
                            />
                            <DeleteFuelButton
                              logId={log.id}
                              vehicleId={id}
                              mileage={log.mileage}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <FileUpload
                            logId={log.id}
                            vehicleId={id}
                            type="fuel"
                          />
                        </div>
                        <FileList files={logFiles} vehicleId={id} type="fuel" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mods" className="space-y-4">
            <div className="flex justify-end">
              <AddModificationDialog vehicleId={id} />
            </div>
            {mods.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No modifications yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {mods.map((mod) => {
                  const modFilesList = modFiles.filter(
                    (f) => f.modificationId === mod.id,
                  );
                  return (
                    <Card key={mod.id}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold">{mod.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {mod.category} {mod.brand ? `• ${mod.brand}` : ""}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Installed{" "}
                              {format(mod.installedDate, "MMM d, yyyy")}
                            </p>
                            {mod.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {mod.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-start gap-2">
                            {mod.cost && (
                              <p className="font-semibold mr-4">
                                ${parseFloat(mod.cost).toFixed(2)}
                              </p>
                            )}
                            <EditModificationDialog
                              vehicleId={id}
                              mod={{
                                id: mod.id,
                                name: mod.name,
                                category: mod.category,
                                brand: mod.brand || undefined,
                                cost: mod.cost
                                  ? parseFloat(mod.cost)
                                  : undefined,
                                installedDate: mod.installedDate,
                                notes: mod.notes || undefined,
                              }}
                            />
                            <DeleteModificationButton
                              modId={mod.id}
                              vehicleId={id}
                              name={mod.name}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <FileUpload
                            logId={mod.id}
                            vehicleId={id}
                            type="modification"
                          />
                        </div>
                        <FileList
                          files={modFilesList}
                          vehicleId={id}
                          type="modification"
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
