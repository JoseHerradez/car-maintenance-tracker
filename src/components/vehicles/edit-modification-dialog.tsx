"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModificationForm } from "@/components/vehicles/modification-form";
import { ModificationFormData } from "@/lib/validations/modification";
import { Edit } from "lucide-react";
import { useState } from "react";

interface Props {
  vehicleId: string;
  mod: ModificationFormData & { id: string };
}

export function EditModificationDialog({ vehicleId, mod }: Props) {
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
          <DialogTitle>Edit Modification</DialogTitle>
        </DialogHeader>
        <ModificationForm
          vehicleId={vehicleId}
          initialData={mod}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
