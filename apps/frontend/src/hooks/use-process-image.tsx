import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_URL } from "@/config/config";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { currentStepAtom, processedImageResultAtom } from "@/config/state";
import { useSetAtom } from "jotai";
import { PrescriptionSchema } from "@/dto/prescription-schema.dto";

export const useProcessImage = () => {
  const setCurrentStep = useSetAtom(currentStepAtom);
  const { getToken } = useAuth();
  const setProcessedImageResult = useSetAtom(processedImageResultAtom);

  const processImage = async (imageUrl: string) => {
    const token = await getToken();
    toast.loading("Processing image...");
    const response = await axios.post(
      `${API_URL}/ai/process-image`,
      { imageUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const parsedData = PrescriptionSchema.safeParse(response.data);
    if (!parsedData.success) {
      throw new Error("Invalid prescription data received");
    }

    setProcessedImageResult(parsedData.data);
  };

  return useMutation({
    mutationKey: ["process-image"],
    mutationFn: processImage,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Image uploaded successfully.");
      setCurrentStep((prev) => prev + 1);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to upload image. Please try again.");
    },
  });
};
