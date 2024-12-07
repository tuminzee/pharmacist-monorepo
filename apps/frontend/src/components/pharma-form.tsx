import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditedPrescription } from "@/dto/prescription-schema.dto";
import { Medicine } from "@/dto/prescription-schema.dto";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  currentStepAtom,
  editedPrescriptionAtom,
  imageAtom,
} from "@/config/state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PharmaForm() {
  const setCurrentStep = useSetAtom(currentStepAtom);
  const [editedPrescription, setEditedPrescription] = useAtom(
    editedPrescriptionAtom
  );
  const image = useAtomValue(imageAtom);

  if (!editedPrescription) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative aspect-[3/4] w-full p-4">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
        <div className="p-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
              <div className="flex justify-center">
                <Skeleton className="h-10 w-32" />
              </div>
              <Button onClick={() => setCurrentStep(0)}>Upload Image</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const onCompareResults = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const updateMedicine = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    setEditedPrescription((prev) => {
      if (!prev) return prev;
      const newMedicines = [...prev.medicines];
      newMedicines[index] = {
        ...newMedicines[index],
        [field]: value,
      };
      return {
        ...prev,
        medicines: newMedicines,
      };
    });
  };

  const updatePrescription = (
    field: keyof EditedPrescription,
    value: string
  ) => {
    setEditedPrescription((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Image */}
      <div className="relative aspect-[3/4] w-full p-4">
        {image.url && (
          <img
            src={image.url}
            alt="Prescription Preview"
            className="h-full w-full rounded-lg object-cover"
          />
        )}
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    value={editedPrescription.doctorName || ""}
                    onChange={(e) =>
                      updatePrescription("doctorName", e.target.value)
                    }
                    placeholder="Doctor Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={editedPrescription.date || ""}
                    onChange={(e) => updatePrescription("date", e.target.value)}
                    placeholder="Prescription Date"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Medicines</h3>
                {editedPrescription.medicines.map((medicine, index) => (
                  <div key={index} className="space-y-4 p-3 sm:p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor={`medicine-name-${index}`}>
                        Medicine Name
                      </Label>
                      <Input
                        id={`medicine-name-${index}`}
                        value={medicine.name}
                        onChange={(e) =>
                          updateMedicine(index, "name", e.target.value)
                        }
                        placeholder="Medicine Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`medicine-dosage-${index}`}>Dosage</Label>
                      <Input
                        id={`medicine-dosage-${index}`}
                        value={medicine.dosage}
                        onChange={(e) =>
                          updateMedicine(index, "dosage", e.target.value)
                        }
                        placeholder="Dosage Instructions"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`medicine-duration-${index}`}>
                        Duration
                      </Label>
                      <Input
                        id={`medicine-duration-${index}`}
                        value={medicine.duration}
                        onChange={(e) =>
                          updateMedicine(index, "duration", e.target.value)
                        }
                        placeholder="Duration"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`medicine-timing-${index}`}>Timing</Label>
                      <Input
                        id={`medicine-timing-${index}`}
                        value={medicine.timing || ""}
                        onChange={(e) =>
                          updateMedicine(index, "timing", e.target.value)
                        }
                        placeholder="When to take"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Additional Remarks</Label>
                <Input
                  id="remarks"
                  value={editedPrescription.remarks || ""}
                  onChange={(e) =>
                    updatePrescription("remarks", e.target.value)
                  }
                  placeholder="Any additional notes or remarks"
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button className="w-full sm:w-auto" onClick={onCompareResults}>
                  Compare Results
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
