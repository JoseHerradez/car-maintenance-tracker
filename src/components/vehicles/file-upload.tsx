"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import {
  uploadMaintenanceFile,
  uploadFuelFile,
  uploadModificationFile,
} from "@/app/actions/files";

interface FileUploadProps {
  logId: string;
  vehicleId: string;
  type: "maintenance" | "fuel" | "modification";
}

export function FileUpload({ logId, vehicleId, type }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === "maintenance") {
        await uploadMaintenanceFile(logId, vehicleId, formData);
      } else if (type === "fuel") {
        await uploadFuelFile(logId, vehicleId, formData);
      } else {
        await uploadModificationFile(logId, vehicleId, formData);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        accept="image/*,.pdf"
      />
      <Button
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Attach File
          </>
        )}
      </Button>
    </div>
  );
}
