import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { Prescription } from "@/dto/prescription-schema.dto";

export const imageAtom = atomWithStorage<{
  url?: string;
  file?: File;
  name?: string;  
}>("image", {});

export const processedImageResultAtom = atomWithStorage<Prescription | null>(
  "processedImageResult",
  null
);

export const editedPrescriptionAtom = atomWithStorage<Prescription | null>(
  "editedPrescription",
  null
);
export const currentStepAtom = atom<number>(0);