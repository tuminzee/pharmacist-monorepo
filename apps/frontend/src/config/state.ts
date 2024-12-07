import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { PrescriptionSchema } from "@/dto/prescription-schema.dto";
import { z } from "zod";

export const imageAtom = atomWithStorage<{
  url?: string;
  file?: File;
  name?: string;
}>("image", {});

export const processedImageResultAtom = atom<
  z.infer<typeof PrescriptionSchema> | null
>(null);
