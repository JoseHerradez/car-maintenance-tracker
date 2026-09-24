"use client";

import { createReminder, updateReminder } from "@/app/actions/reminders";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ReminderFormData, reminderSchema } from "@/lib/validations/reminder";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ReminderFormProps {
  vehicleId: string;
  initialData?: ReminderFormData & { id: string };
  onSuccess?: () => void;
}

export function ReminderForm({
  vehicleId,
  initialData,
  onSuccess,
}: ReminderFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: initialData || {
      title: "",
      type: "time",
      dueDate: null,
      dueMileage: null,
      notes: "",
    },
  });

  const currentType = watch("type");

  async function onSubmit(data: ReminderFormData) {
    setIsPending(true);
    try {
      if (initialData?.id) {
        await updateReminder(initialData.id, vehicleId, data);
      } else {
        await createReminder(vehicleId, data);
      }
      reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field data-invalid={!!errors.title}>
        <FieldLabel>Title</FieldLabel>
        <Input
          placeholder="Oil Change, Tire Rotation, etc."
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && <FieldError>{errors.title.message}</FieldError>}
      </Field>

      <Field data-invalid={!!errors.type}>
        <FieldLabel>Reminder Type</FieldLabel>
        <Select
          defaultValue={initialData?.type || "time"}
          onValueChange={(value: "time" | "mileage" | null) => {
            if (value) {
              if (value === "time") {
                setValue("type", value);
                setValue("dueMileage", null);
              } else if (value === "mileage") {
                setValue("type", value);
                setValue("dueDate", null);
              }
            }
          }}
        >
          <SelectTrigger aria-invalid={!!errors.type}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time">Time-based</SelectItem>
            <SelectItem value="mileage">Mileage-based</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <FieldError>{errors.type.message}</FieldError>}
      </Field>

      {currentType === "time" && (
        <Field data-invalid={!!errors.dueDate}>
          <FieldLabel>Due Date</FieldLabel>
          <Input
            type="date"
            aria-invalid={!!errors.dueDate}
            {...register("dueDate", { valueAsDate: true })}
          />
          {errors.dueDate && <FieldError>{errors.dueDate.message}</FieldError>}
        </Field>
      )}

      {currentType === "mileage" && (
        <Field data-invalid={!!errors.dueMileage}>
          <FieldLabel>Due Mileage</FieldLabel>
          <Input
            type="number"
            aria-invalid={!!errors.dueMileage}
            {...register("dueMileage", { valueAsNumber: true })}
          />
          {errors.dueMileage && (
            <FieldError>{errors.dueMileage.message}</FieldError>
          )}
        </Field>
      )}

      <Field data-invalid={!!errors.notes}>
        <FieldLabel>Notes (Optional)</FieldLabel>
        <Textarea
          placeholder="Additional details..."
          aria-invalid={!!errors.notes}
          {...register("notes")}
        />
        {errors.notes && <FieldError>{errors.notes.message}</FieldError>}
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? "Saving..."
          : initialData
            ? "Update Reminder"
            : "Add Reminder"}
      </Button>
    </form>
  );
}
