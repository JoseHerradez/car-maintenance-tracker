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
import { Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  vehicleId: string;
}

export function AddReminderDialog({ vehicleId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Reminder
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
        </DialogHeader>
        <ReminderForm vehicleId={vehicleId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
