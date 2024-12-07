import { Injectable, Logger } from '@nestjs/common';
import { ComparePrescriptionDtos } from 'src/metrics/dto/compare-prescription.dto';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  compare(comparePrescriptionDtos: ComparePrescriptionDtos) {
    this.logger.log(
      `Comparing prescriptions: ${JSON.stringify(comparePrescriptionDtos)}`,
    );
    const { ai, user } = comparePrescriptionDtos;

    // Compare medicines arrays
    const totalMedicines = Math.max(ai.medicines.length, user.medicines.length);
    let matchingMedicines = 0;

    // Compare each medicine
    ai.medicines.forEach((aiMed) => {
      const matchingMed = user.medicines.find(
        (userMed) =>
          aiMed.name.toLowerCase() === userMed.name.toLowerCase() &&
          aiMed.dosage === userMed.dosage &&
          aiMed.duration === userMed.duration &&
          aiMed.timing === userMed.timing,
      );
      if (matchingMed) matchingMedicines++;
    });

    // Calculate overall match percentage
    const medicineMatchPercentage = (matchingMedicines / totalMedicines) * 100;

    // Compare optional fields
    const doctorNameMatch = ai.doctorName === user.doctorName ? 1 : 0;
    const dateMatch = ai.date === user.date ? 1 : 0;
    const optionalFieldsMatch = ((doctorNameMatch + dateMatch) / 2) * 100;

    // Calculate total match percentage
    const totalMatchPercentage =
      medicineMatchPercentage * 0.8 + optionalFieldsMatch * 0.2;

    return {
      totalMatchPercentage: Math.round(totalMatchPercentage),
      medicineMatchPercentage: Math.round(medicineMatchPercentage),
      optionalFieldsMatchPercentage: Math.round(optionalFieldsMatch),
      details: {
        totalMedicines,
        matchingMedicines,
        doctorNameMatch: Boolean(doctorNameMatch),
        dateMatch: Boolean(dateMatch),
      },
    };
  }
}
