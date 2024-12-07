export interface ComparisonDetails {
  totalMedicines: number;
  matchingMedicines: number;
  doctorNameMatch: boolean;
  dateMatch: boolean;
}

export interface PrescriptionComparison {
  totalMatchPercentage: number;
  medicineMatchPercentage: number;
  optionalFieldsMatchPercentage: number;
  details: ComparisonDetails;
}