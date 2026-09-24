"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FuelForm } from "@/components/vehicles/fuel-form";
import { FuelLogFormData } from "@/lib/validations/fuel";
import { Edit } from "lucide-react";
import { useState } from "react";

interface Props {
  vehicleId: string;
  log: FuelLogFormData & { id: string };
}

export function EditFuelDialog({ vehicleId, log }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Fuel Log</DialogTitle>
        </DialogHeader>
        <FuelForm
          vehicleId={vehicleId}
          initialData={log}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
