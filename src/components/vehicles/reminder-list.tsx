import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteReminderButton } from "@/components/vehicles/delete-reminder-button";
import { EditReminderDialog } from "@/components/vehicles/edit-reminder-dialog";
import { ToggleReminderButton } from "@/components/vehicles/toggle-reminder-button";
import {
  differenceInDays,
  format,
  isPast,
  isToday,
  isTomorrow,
} from "date-fns";
import { Bell, Calendar, Gauge } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  type: string;
  dueDate: Date | null;
  dueMileage: number | null;
  notes: string | null;
  isCompleted: boolean;
}

interface ReminderListProps {
  reminders: Reminder[];
  vehicleId: string;
  currentMileage?: number;
}

function getReminderStatus(reminder: Reminder, currentMileage?: number) {
  if (reminder.isCompleted)
    return { label: "Completed", variant: "secondary" as const };

  if (reminder.type === "time" && reminder.dueDate) {
    const dueDate = new Date(reminder.dueDate);
    if (isPast(dueDate) && !isToday(dueDate)) {
      return { label: "Overdue", variant: "destructive" as const };
    }
    if (isToday(dueDate)) {
      return { label: "Due Today", variant: "destructive" as const };
    }
    if (isTomorrow(dueDate)) {
      return { label: "Due Tomorrow", variant: "default" as const };
    }
    const daysUntil = differenceInDays(dueDate, new Date());
    if (daysUntil <= 7) {
      return { label: `Due in ${daysUntil} days`, variant: "default" as const };
    }
    return { label: `Due in ${daysUntil} days`, variant: "secondary" as const };
  }

  if (
    reminder.type === "mileage" &&
    reminder.dueMileage &&
    currentMileage !== undefined
  ) {
    const milesUntil = reminder.dueMileage - currentMileage;
    if (milesUntil <= 0) {
      return { label: "Overdue", variant: "destructive" as const };
    }
    if (milesUntil <= 500) {
      return { label: `Due in ${milesUntil} mi`, variant: "default" as const };
    }
    return { label: `Due in ${milesUntil} mi`, variant: "secondary" as const };
  }

  return { label: "Upcoming", variant: "secondary" as const };
}

export function ReminderList({
  reminders,
  vehicleId,
  currentMileage,
}: ReminderListProps) {
  if (reminders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No reminders set.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {reminders.map((reminder) => {
        const status = getReminderStatus(reminder, currentMileage);

        return (
          <Card
            key={reminder.id}
            className={reminder.isCompleted ? "opacity-60" : ""}
          >
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <ToggleReminderButton
                    reminderId={reminder.id}
                    vehicleId={vehicleId}
                    isCompleted={reminder.isCompleted}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className={`font-semibold ${reminder.isCompleted ? "line-through" : ""}`}
                      >
                        {reminder.title}
                      </p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {reminder.type === "time" && reminder.dueDate && (
                        <>
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(reminder.dueDate), "MMM d, yyyy")}
                          </span>
                        </>
                      )}
                      {reminder.type === "mileage" && reminder.dueMileage && (
                        <>
                          <Gauge className="h-3 w-3" />
                          <span>
                            {reminder.dueMileage.toLocaleString()} miles
                          </span>
                        </>
                      )}
                    </div>
                    {reminder.notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {reminder.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <EditReminderDialog
                    vehicleId={vehicleId}
                    reminder={{
                      id: reminder.id,
                      title: reminder.title,
                      type: reminder.type as "time" | "mileage",
                      dueDate: reminder.dueDate || undefined,
                      dueMileage: reminder.dueMileage || undefined,
                      notes: reminder.notes || undefined,
                    }}
                  />
                  <DeleteReminderButton
                    reminderId={reminder.id}
                    vehicleId={vehicleId}
                    title={reminder.title}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
