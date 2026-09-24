"use client";

import {
  createMaintenanceLog,
  updateMaintenanceLog,
} from "@/app/actions/maintenance";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MaintenanceLogFormData,
  maintenanceLogSchema,
} from "@/lib/validations/maintenance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface MaintenanceFormProps {
  vehicleId: string;
  initialData?: MaintenanceLogFormData & { id: string };
  onSuccess?: () => void;
}

export function MaintenanceForm({
  vehicleId,
  initialData,
  onSuccess,
}: MaintenanceFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceLogFormData>({
    resolver: zodResolver(maintenanceLogSchema),
    defaultValues: initialData || {
      serviceType: "",
      date: new Date(),
      mileage: 0,
      cost: 0,
      notes: "",
    },
  });

  async function onSubmit(data: MaintenanceLogFormData) {
    setIsPending(true);
    try {
      if (initialData?.id) {
        await updateMaintenanceLog(initialData.id, vehicleId, data);
      } else {
        await createMaintenanceLog(vehicleId, data);
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
      <Field data-invalid={!!errors.serviceType}>
        <FieldLabel>Service Type</FieldLabel>
        <Input
          placeholder="Oil Change, Brake Pads, etc."
          aria-invalid={!!errors.serviceType}
          {...register("serviceType")}
        />
        {errors.serviceType && (
          <FieldError>{errors.serviceType.message}</FieldError>
        )}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.date}>
          <FieldLabel>Date</FieldLabel>
          <Input
            type="date"
            aria-invalid={!!errors.date}
            {...register("date", { valueAsDate: true })}
          />
          {errors.date && <FieldError>{errors.date.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.mileage}>
          <FieldLabel>Mileage</FieldLabel>
          <Input
            type="number"
            aria-invalid={!!errors.mileage}
            {...register("mileage", { valueAsNumber: true })}
          />
          {errors.mileage && <FieldError>{errors.mileage.message}</FieldError>}
        </Field>
      </div>

      <Field data-invalid={!!errors.cost}>
        <FieldLabel>Cost (Optional)</FieldLabel>
        <Input
          type="number"
          step="0.01"
          aria-invalid={!!errors.cost}
          {...register("cost", { valueAsNumber: true })}
        />
        {errors.cost && <FieldError>{errors.cost.message}</FieldError>}
      </Field>

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
        {isPending ? "Saving..." : initialData ? "Update Log" : "Add Log"}
      </Button>
    </form>
  );
}
