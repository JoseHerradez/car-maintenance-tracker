"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MaintenanceForm } from "@/components/vehicles/maintenance-form";
import { MaintenanceLogFormData } from "@/lib/validations/maintenance";
import { Edit } from "lucide-react";
import { useState } from "react";

interface Props {
  vehicleId: string;
  log: MaintenanceLogFormData & { id: string };
}

export function EditMaintenanceDialog({ vehicleId, log }: Props) {
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
          <DialogTitle>Edit Maintenance Log</DialogTitle>
        </DialogHeader>
        <MaintenanceForm
          vehicleId={vehicleId}
          initialData={log}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
