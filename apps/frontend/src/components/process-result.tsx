import { useAtomValue } from "jotai";
import { processedImageResultAtom } from "@/config/state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessResult() {
  const result = useAtomValue(processedImageResultAtom);

  if (!result) return null;

  return (
    <div className="p-6">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Doctor and Date Information */}
          <div className="mb-6 flex flex-wrap gap-x-8 text-sm text-muted-foreground">
            {result.doctorName && (
              <div>
                <span className="font-medium text-foreground">Doctor: </span>
                {result.doctorName}
              </div>
            )}
            {result.date && (
              <div>
                <span className="font-medium text-foreground">Date: </span>
                {result.date}
              </div>
            )}
          </div>

          {/* Medicines List */}
          <div className="space-y-4">
            {result.medicines.map((medicine, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h4 className="mb-4 font-semibold">{medicine.name}</h4>
                  <div className="grid gap-2 text-sm">
                    <div>
                      <span className="font-medium">Dosage: </span>
                      <span className="text-muted-foreground">{medicine.dosage}</span>
                    </div>
                    <div>
                      <span className="font-medium">Duration: </span>
                      <span className="text-muted-foreground">{medicine.duration}</span>
                    </div>
                    {medicine.timing && (
                      <div>
                        <span className="font-medium">Timing: </span>
                        <span className="text-muted-foreground">{medicine.timing}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
