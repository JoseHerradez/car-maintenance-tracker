"use client";

import { createVehicle, updateVehicle } from "@/app/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { VehicleFormData, vehicleSchema } from "@/lib/validations/vehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface VehicleFormProps {
  initialData?: VehicleFormData & { id: string };
  onSuccess?: () => void;
}

export function VehicleForm({ initialData, onSuccess }: VehicleFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      make: "",
      model: "",
      year: 2020,
      vin: "",
      licensePlate: "",
      purchasePrice: 0,
      purchaseDate: null,
    },
  });

  async function onSubmit(data: VehicleFormData) {
    setIsPending(true);
    try {
      if (initialData?.id) {
        await updateVehicle(initialData.id, data);
      } else {
        await createVehicle(data);
      }
      reset();
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.make}>
          <FieldLabel>Make</FieldLabel>
          <Input
            placeholder="Toyota"
            aria-invalid={!!errors.make}
            {...register("make")}
          />
          {errors.make && <FieldError>{errors.make.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.model}>
          <FieldLabel>Model</FieldLabel>
          <Input
            placeholder="Camry"
            aria-invalid={!!errors.model}
            {...register("model")}
          />
          {errors.model && <FieldError>{errors.model.message}</FieldError>}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.year}>
          <FieldLabel>Year</FieldLabel>
          <Input
            type="number"
            aria-invalid={!!errors.year}
            {...register("year", { valueAsNumber: true })}
          />
          {errors.year && <FieldError>{errors.year.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.licensePlate}>
          <FieldLabel>License Plate</FieldLabel>
          <Input
            placeholder="ABC-1234"
            aria-invalid={!!errors.licensePlate}
            {...register("licensePlate")}
          />
          {errors.licensePlate && (
            <FieldError>{errors.licensePlate.message}</FieldError>
          )}
        </Field>
      </div>

      <Field data-invalid={!!errors.vin}>
        <FieldLabel>VIN (Optional)</FieldLabel>
        <Input
          placeholder="1HGCM82633A004352"
          aria-invalid={!!errors.vin}
          {...register("vin")}
        />
        {errors.vin && <FieldError>{errors.vin.message}</FieldError>}
      </Field>

      <Field data-invalid={!!errors.purchasePrice}>
        <FieldLabel>Purchase Price (Optional)</FieldLabel>
        <Input
          type="number"
          step="0.01"
          aria-invalid={!!errors.purchasePrice}
          {...register("purchasePrice", { valueAsNumber: true })}
        />
        {errors.purchasePrice && (
          <FieldError>{errors.purchasePrice.message}</FieldError>
        )}
      </Field>

      <Field data-invalid={!!errors.purchaseDate}>
        <FieldLabel>Purchase Date (Optional)</FieldLabel>
        <Input
          type="date"
          aria-invalid={!!errors.purchaseDate}
          {...register("purchaseDate", { valueAsDate: true })}
        />
        {errors.purchaseDate && (
          <FieldError>{errors.purchaseDate.message}</FieldError>
        )}
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? "Saving..."
          : initialData
            ? "Update Vehicle"
            : "Add Vehicle"}
      </Button>
    </form>
  );
}
