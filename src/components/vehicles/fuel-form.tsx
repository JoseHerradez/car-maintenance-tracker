"use client";

import { createFuelLog, updateFuelLog } from "@/app/actions/fuel";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FuelLogFormData, fuelLogSchema } from "@/lib/validations/fuel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FuelFormProps {
  vehicleId: string;
  initialData?: FuelLogFormData & { id: string };
  onSuccess?: () => void;
}

export function FuelForm({ vehicleId, initialData, onSuccess }: FuelFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FuelLogFormData>({
    resolver: zodResolver(fuelLogSchema),
    defaultValues: initialData || {
      date: new Date(),
      mileage: 0,
      gallons: 0,
      totalCost: 0,
    },
  });

  async function onSubmit(data: FuelLogFormData) {
    setIsPending(true);
    try {
      if (initialData?.id) {
        await updateFuelLog(initialData.id, vehicleId, data);
      } else {
        await createFuelLog(vehicleId, data);
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

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.gallons}>
          <FieldLabel>Gallons</FieldLabel>
          <Input
            type="number"
            step="0.01"
            aria-invalid={!!errors.gallons}
            {...register("gallons", { valueAsNumber: true })}
          />
          {errors.gallons && <FieldError>{errors.gallons.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.totalCost}>
          <FieldLabel>Total Cost</FieldLabel>
          <Input
            type="number"
            step="0.01"
            aria-invalid={!!errors.totalCost}
            {...register("totalCost", { valueAsNumber: true })}
          />
          {errors.totalCost && (
            <FieldError>{errors.totalCost.message}</FieldError>
          )}
        </Field>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : initialData ? "Update Log" : "Add Fill-up"}
      </Button>
    </form>
  );
}
