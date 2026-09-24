import { logoutUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { VehicleGarage } from "@/components/vehicles/vehicle-garage";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <form
            className="cursor-pointer"
            onSubmit={async () => {
              "use server";
              await logoutUser();
              redirect("/");
            }}
          >
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <VehicleGarage userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
