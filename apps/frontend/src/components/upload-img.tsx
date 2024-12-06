import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

export default function UploadImg() {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

    try {
      const promise = (): Promise<{ msg: string }> =>
        new Promise<{ msg: string }>((resolve) =>
          setTimeout(() => resolve({ msg: "Image has been uploaded" }), 2000)
        );

      toast.promise(promise(), {
        loading: "Loading...",
        success: (data: { msg: string }) => {
          return data.msg;
        },
        error: "Error",
      });

      // Clear preview and files after successful upload
    } catch (_err) {
      setError("Failed to upload image. Please try again.");
      // Show error toast
      toast.error("Failed to upload image. Please try again.");
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const files = acceptedFiles.map((file) => (
    <li key={file.path} className="text-sm text-gray-600 py-1">
      {file.path} - {Math.round(file.size / 1024)} KB
    </li>
  ));

  return (
    <section className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <div
        {...getRootProps({
          className: `cursor-pointer text-center hover:bg-gray-100 transition-colors duration-200 py-8 ${
            error ? "border-red-300 bg-red-50" : ""
          }`,
        })}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 mb-2">
          Drag 'n' drop some files here, or click to select files
        </p>
        <p className="text-sm text-gray-500">
          Supported files: .jpg, .png, .webp, .jpeg (max 1MB)
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
        <div className="mt-6 border-t border-gray-200 pt-4">
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
            className="mt-4 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Upload Image
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
