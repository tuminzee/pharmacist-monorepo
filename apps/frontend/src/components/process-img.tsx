import { currentStepAtom, imageAtom } from "@/config/state";
import { useProcessImage } from "@/hooks/use-process-image";
import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProcessImg() {
  const image = useAtomValue(imageAtom);
  const { mutate: processImage, isPending: processImageIsPending } =
    useProcessImage();
  const setCurrentStep = useSetAtom(currentStepAtom);

  if (!image.url) {
    toast.error("Please upload an image first");
  }

  const handleProcessImage = () => {
    if (image.url) {
      processImage(image.url);
    } else {
      toast.error("Please upload an image first");
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {image.url ? (
        <Card className="overflow-hidden">
          <img
            src={image.url}
            alt="Preview"
            className="max-h-[400px] w-auto object-contain"
          />
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <Skeleton className="h-[400px] w-[600px]" />
          </Card>
          <Button onClick={() => setCurrentStep(0)}>Upload Image</Button>
        </>
      )}

      <Button
        disabled={!image.url || processImageIsPending}
        onClick={handleProcessImage}
      >
        {processImageIsPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Process Image"
        )}
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Reupload Image
        </Button>
      </div>
    </div>
  );
}
