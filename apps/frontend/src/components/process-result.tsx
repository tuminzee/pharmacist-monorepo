import { useAtomValue, useSetAtom } from "jotai";
import {
  currentStepAtom,
  editedPrescriptionAtom,
  processedImageResultAtom,
} from "@/config/state";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function ProcessResult() {
  const result = useAtomValue(processedImageResultAtom);
  const setEditedPrescription = useSetAtom(editedPrescriptionAtom);
  const setCurrentStep = useSetAtom(currentStepAtom);

  if (!result) {
    return (
      <div className="p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Doctor and Date Information Skeleton */}
            <div className="mb-6 flex flex-wrap gap-x-8">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-40" />
            </div>

            {/* Medicines List Skeleton */}
            <div className="space-y-4">
              {[1, 2].map((_, index) => (
                <>
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-6 w-40 mb-4" />
                      <div className="grid gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              ))}
              <Button onClick={() => setCurrentStep(0)}>Upload Image</Button>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const onGenerateForm = () => {
    setEditedPrescription({
      ...result,
      remarks: "",
    });
    toast.success("Form generated successfully");
    setCurrentStep((prev) => prev + 1);
  };

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
                      <span className="text-muted-foreground">
                        {medicine.dosage}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Duration: </span>
                      <span className="text-muted-foreground">
                        {medicine.duration}
                      </span>
                    </div>
                    {medicine.timing && (
                      <div>
                        <span className="font-medium">Timing: </span>
                        <span className="text-muted-foreground">
                          {medicine.timing}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onGenerateForm}>
            Generate Form
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
