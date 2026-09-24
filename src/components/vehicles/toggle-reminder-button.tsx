"use client";

import { toggleReminderComplete } from "@/app/actions/reminders";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  reminderId: string;
  vehicleId: string;
  isCompleted: boolean;
}

export function ToggleReminderButton({
  reminderId,
  vehicleId,
  isCompleted,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await toggleReminderComplete(reminderId, vehicleId, isCompleted);
        router.refresh();
      } catch (error) {
        console.error("Failed to toggle reminder:", error);
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
    </Button>
  );
}
