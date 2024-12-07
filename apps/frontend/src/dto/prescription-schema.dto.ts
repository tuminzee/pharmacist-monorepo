import { z } from "zod";

export const PrescriptionSchema = z.object({
  medicines: z.array(
    z.object({
      name: z.string().describe("Name of the medicine"),
      dosage: z.string().describe("Dosage instructions"),
      duration: z.string().describe("Duration of the prescription"),
      timing: z.string().optional().describe("When to take the medicine"),
    })
  ),
  doctorName: z.string().optional().describe("Name of the prescribing doctor"),
  date: z.string().optional().describe("Date of prescription"),
});