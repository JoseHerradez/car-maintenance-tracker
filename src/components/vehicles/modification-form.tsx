"use client";

import {
  createModification,
  updateModification,
} from "@/app/actions/modifications";
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
import {
  ModificationFormData,
  modificationSchema,
} from "@/lib/validations/modification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ModificationFormProps {
  vehicleId: string;
  initialData?: ModificationFormData & { id: string };
  onSuccess?: () => void;
}

const CATEGORIES = [
  "Performance",
  "Aesthetic",
  "Interior",
  "Exterior",
  "Wheels/Tires",
  "Suspension",
  "Other",
];

export function ModificationForm({
  vehicleId,
  initialData,
  onSuccess,
}: ModificationFormProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ModificationFormData>({
    resolver: zodResolver(modificationSchema),
    defaultValues: initialData || {
      name: "",
      category: "",
      brand: "",
      cost: 0,
      installedDate: new Date(),
      notes: "",
    },
  });

  async function onSubmit(data: ModificationFormData) {
    setIsPending(true);
    try {
      if (initialData?.id) {
        await updateModification(initialData.id, vehicleId, data);
      } else {
        await createModification(vehicleId, data);
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
      <Field data-invalid={!!errors.name}>
        <FieldLabel>Name</FieldLabel>
        <Input
          placeholder="Cold Air Intake, Body Kit, etc."
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.category}>
          <FieldLabel>Category</FieldLabel>
          <Select
            defaultValue={initialData?.category}
            onValueChange={(value) => {
              if (value) {
                setValue("category", value);
              }
            }}
          >
            <SelectTrigger aria-invalid={!!errors.category}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <FieldError>{errors.category.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.brand}>
          <FieldLabel>Brand (Optional)</FieldLabel>
          <Input
            placeholder="Brembo, K&N, etc."
            aria-invalid={!!errors.brand}
            {...register("brand")}
          />
          {errors.brand && <FieldError>{errors.brand.message}</FieldError>}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
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

        <Field data-invalid={!!errors.installedDate}>
          <FieldLabel>Installed Date</FieldLabel>
          <Input
            type="date"
            aria-invalid={!!errors.installedDate}
            {...register("installedDate", { valueAsDate: true })}
          />
          {errors.installedDate && (
            <FieldError>{errors.installedDate.message}</FieldError>
          )}
        </Field>
      </div>

      <Field data-invalid={!!errors.notes}>
        <FieldLabel>Notes (Optional)</FieldLabel>
        <Textarea
          placeholder="Installation details, part numbers, etc."
          aria-invalid={!!errors.notes}
          {...register("notes")}
        />
        {errors.notes && <FieldError>{errors.notes.message}</FieldError>}
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : initialData ? "Update Mod" : "Add Mod"}
      </Button>
    </form>
  );
}
