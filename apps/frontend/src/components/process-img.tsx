import { imageAtom } from "@/config/state";
import { useProcessImage } from "@/hooks/use-process-image";
import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function ProcessImg() {
  const image = useAtomValue(imageAtom);
  const { mutate: processImage, isPending: processImageIsPending } = useProcessImage();

  const handleProcessImage = () => {
    if (image.url) {
      processImage(image.url);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {image.url && (
        <Card className="overflow-hidden">
          <img
            src={image.url}
            alt="Preview"
            className="max-h-[400px] w-auto object-contain"
          />
        </Card>
      )}

      <Button
        size="lg"
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
    </div>
  );
}
