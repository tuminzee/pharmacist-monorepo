import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CircleX, Loader2, UploadIcon } from "lucide-react";
import { useUpload } from "../hooks/use-upload";

export default function UploadImg() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: uploadImage, isPending: isImageUploadPending } = useUpload();

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

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // const files = acceptedFiles.map((file) => (
  //   <li key={file.path} className="text-sm text-gray-600 py-1">
  //     {file.path} - {Math.round(file.size / 1024)} KB
  //   </li>
  // ));

  return (
    <section className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <div
        {...getRootProps({
          className: `
            cursor-pointer text-center 
            hover:bg-gray-100 transition-all duration-200 
            rounded-lg border-2 border-dashed 
            ${
              error
                ? "border-red-300 bg-red-50 hover:bg-red-50"
                : "border-gray-300 hover:border-blue-400"
            }
            p-8 flex flex-col items-center justify-center gap-2
          `,
        })}
      >
        <input {...getInputProps()} />
        <div className="p-4 rounded-full bg-gray-100 mb-2">
          <UploadIcon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-700 font-medium">
          Drag and drop your image here
        </p>
        <p className="text-sm text-gray-500">or click to browse files</p>
        <p className="text-xs text-gray-400 mt-2">
          Supports: JPG, PNG, WebP (max 1MB)
        </p>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded flex items-center justify-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <CircleX />
          </button>
        </div>
      )}

      {preview && (
        <div className="mt-6 border-t flex flex-col items-center border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
          <div className="flex justify-center items-center">
            <div className="relative w-32 h-32">
              <img
                src={preview}
                alt="Upload preview"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={isImageUploadPending}
            className="mt-4 w-80 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isImageUploadPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            <span>
              {isImageUploadPending ? "Uploading..." : "Upload Image"}
            </span>
          </button>
        </div>
      )}

      {/* {acceptedFiles.length > 0 && (
        <aside className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Files</h4>
          <ul className="list-none">{files}</ul>
        </aside>
      )} */}
    </section>
  );
}
