"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VehicleForm } from "@/components/vehicles/vehicle-form";
import { VehicleFormData } from "@/lib/validations/vehicle";
import { Edit } from "lucide-react";
import { useState } from "react";

interface EditVehicleDialogProps {
  vehicle: VehicleFormData & { id: string };
}

export function EditVehicleDialog({ vehicle }: EditVehicleDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>
        <VehicleForm initialData={vehicle} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
