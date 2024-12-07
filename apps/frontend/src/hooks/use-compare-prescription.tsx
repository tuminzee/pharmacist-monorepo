import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_URL } from "@/config/config";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  EditedPrescription,
  Prescription,
} from "@/dto/prescription-schema.dto";
import { PrescriptionComparison } from "@/dto/compare-prescription-res.dto";
import { compareResultAtom } from "@/config/state";
import { useSetAtom } from "jotai";

export const useComparePrescription = () => {
  const { getToken } = useAuth();
  const setCompareResult = useSetAtom(compareResultAtom);

  const comparePrescription = async (
    ai: Prescription,
    user: EditedPrescription
  ) => {
    const token = await getToken();
    toast.loading("Processing image...");
    const response = await axios.post(
      `${API_URL}/metrics/`,
      { ai, user },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  return useMutation<
    PrescriptionComparison,
    Error,
    { ai: Prescription; user: EditedPrescription }
  >({
    mutationKey: ["compare-prescription"],
    mutationFn: (args: { ai: Prescription; user: EditedPrescription }) =>
      comparePrescription(args.ai, args.user),
    onSuccess: (data) => {
      toast.dismiss();
      setCompareResult(data);
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to upload image. Please try again.");
    },
  });
};
