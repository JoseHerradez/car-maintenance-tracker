"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReminderForm } from "@/components/vehicles/reminder-form";
import { ReminderFormData } from "@/lib/validations/reminder";
import { Edit } from "lucide-react";
import { useState } from "react";

interface Props {
  vehicleId: string;
  reminder: ReminderFormData & { id: string };
}

export function EditReminderDialog({ vehicleId, reminder }: Props) {
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
          <DialogTitle>Edit Reminder</DialogTitle>
        </DialogHeader>
        <ReminderForm
          vehicleId={vehicleId}
          initialData={reminder}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
