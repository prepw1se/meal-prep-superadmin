"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      setError(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image.");
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be less than 5MB.");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("meal-images")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("meal-images").getPublicUrl(filePath);

      onImageUpload(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(
        error instanceof Error ? error.message : "Error uploading image!",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Image</Label>
      <div className="flex items-center gap-4">
        {currentImageUrl && (
          <div className="relative w-32 h-32">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={onImageRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <Label
            htmlFor="image-upload"
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
          </Label>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
