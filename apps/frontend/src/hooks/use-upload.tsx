import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_URL } from "#/config";

const uploadImage = async (file: File) => {
  toast.loading("Uploading image...");
  const formData = new FormData();
  formData.append("file", file);
  return await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
};

export const useUpload = () => {
  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => toast.dismiss(),
    onError: () => {
      toast.dismiss();
      toast.error("Failed to upload image. Please try again.");
    },
  });
};
