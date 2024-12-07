import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { EditedPrescription, Prescription } from "@/dto/prescription-schema.dto";
import { PrescriptionComparison } from '@/dto/compare-prescription-res.dto';

export const imageAtom = atomWithStorage<{
  url?: string; 
}>("image", {
  url: undefined,
});

export const processedImageResultAtom = atomWithStorage<Prescription | null>(
  "processedImageResult",
  null
);

export const editedPrescriptionAtom = atomWithStorage<
  EditedPrescription | null
>("editedPrescription", null);
export const currentStepAtom = atom<number>(0);

export const compareResultAtom = atom<PrescriptionComparison | null>(null);
