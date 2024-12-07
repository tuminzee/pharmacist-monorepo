import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CircleX, Loader2, UploadIcon } from "lucide-react";
import { useUploadImage } from "@/hooks/use-upload-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function UploadImg() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: uploadImage, isPending: isImageUploadPending } =
    useUploadImage();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 1024 * 1024, // 1MB in bytes
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection.errors[0].code === "file-too-large") {
        const errorMsg = "File is too large. Maximum size is 1MB";
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (rejection.errors[0].code === "file-invalid-type") {
        const errorMsg = "Please upload only images (.jpg, .jpeg, .png, .webp)";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    },
    onDropAccepted: (files) => {
      setError(null);
      const url = URL.createObjectURL(files[0]);
      setPreview(url);
    },
  });

  const handleUpload = async () => {
    if (acceptedFiles.length === 0) return;
    await uploadImage(acceptedFiles[0]);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <Card className="p-6">
      <div
        {...getRootProps({
          className: cn(
            "cursor-pointer text-center rounded-lg border-2 border-dashed p-8",
            "hover:bg-accent transition-colors duration-200",
            "flex flex-col items-center justify-center gap-2",
            error
              ? "border-destructive/50 bg-destructive/10"
              : "border-muted hover:border-primary"
          ),
        })}
      >
        <input {...getInputProps()} />
        <div className="p-4 rounded-full bg-muted mb-2">
          <UploadIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium">
          Drag and drop your image here
        </p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
        <p className="text-xs text-muted-foreground mt-2">
          Supports: JPG, PNG, WebP (max 1MB)
        </p>
      </div>

      {error && (
        <div className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded flex items-center justify-center">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setError(null)}
            className="ml-2 h-4 w-4 hover:bg-destructive/20"
          >
            <CircleX className="h-4 w-4" />
          </Button>
        </div>
      )}

      {preview && (
        <div className="flex flex-col items-center gap-4 mt-6 pt-4 border-t">
          <Card className="overflow-hidden">
            <img
              src={preview}
              alt="Upload preview"
              className="max-h-[400px] w-auto object-contain"
            />
          </Card>
          <Button
            size="lg"
            onClick={handleUpload}
            disabled={isImageUploadPending}
          >
            {isImageUploadPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
