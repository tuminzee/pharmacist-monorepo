import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_URL } from "@/config/config";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { imageAtom } from "@/config/state";
import { useSetAtom } from "jotai";

export const useUploadImage = () => {
  const { getToken } = useAuth();
  const setImageAtom = useSetAtom(imageAtom);

  const uploadImage = async (file: File) => {
    const token = await getToken();
    toast.loading("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
    setImageAtom(response.data);
  };

  return useMutation({
    mutationKey: ["upload-image"],
    mutationFn: uploadImage,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Image uploaded successfully.");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to upload image. Please try again.");
    },
  });
};
