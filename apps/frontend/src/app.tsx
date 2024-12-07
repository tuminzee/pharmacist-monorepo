import "@/app.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import UploadImg from "@/components/upload-img";
import ProcessImg from "@/components/process-img";
import { imageAtom, processedImageResultAtom } from "@/config/state";
import { useAtomValue, useSetAtom } from "jotai";
import { ProcessResult } from "./components/process-result";
import "rc-steps/assets/index.css";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function App() {
  const user = useUser();
  const image = useAtomValue(imageAtom);
  const processedImageResult = useAtomValue(processedImageResultAtom);
  const setImage = useSetAtom(imageAtom);
  const setProcessedImageResult = useSetAtom(processedImageResultAtom);

  const currentStep = !image.url ? 0 : !processedImageResult ? 1 : 2;

  const handleBack = () => {
    if (currentStep === 2) {
      setProcessedImageResult(null);
    } else if (currentStep === 1) {
      setImage({ url: "" });
    }
  };

  const renderSteps = () => {
    const steps = [
      {
        title: "1. Upload Prescription",
        status:
          currentStep > 0 ? "finish" : currentStep === 0 ? "process" : "wait",
      },
      {
        title: "2. Process Image",
        status:
          currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait",
      },
      {
        title: "3. Review Results",
        status: currentStep === 2 ? "process" : "wait",
      },
    ];

    return (
      <div className="flex w-full max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 relative ${index !== steps.length - 1 ? "pr-4" : ""}`}
          >
            <div
              className={`
                h-12 flex items-center px-4 rounded-lg
                ${
                  step.status === "process"
                    ? "bg-primary/10 text-primary"
                    : step.status === "finish"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }
                ${index !== steps.length - 1 ? "mr-[2px]" : ""}
              `}
            >
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index !== steps.length - 1 && (
              <div
                className="absolute right-2 top-0 bottom-0 w-4 h-12 flex items-center"
                style={{
                  clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                  backgroundColor:
                    step.status === "finish"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          {currentStep > 0 ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-9" />
          )}

          <h1 className="text-xl font-semibold">
            {currentStep === 0 && "Upload Prescription"}
            {currentStep === 1 && "Process Image"}
            {currentStep === 2 && "Review Results"}
          </h1>

          <div>
            <SignedOut>
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <div className="border-b bg-background py-4">{renderSteps()}</div>

      <main className="container mx-auto p-4">
        <Card className="mt-8">
          {user.isSignedIn ? (
            <>
              {currentStep === 0 && <UploadImg />}
              {currentStep === 1 && <ProcessImg />}
              {currentStep === 2 && <ProcessResult />}
            </>
          ) : (
            <div className="p-6 text-center">
              <SignInButton>
                <Button size="lg">Sign in to continue</Button>
              </SignInButton>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

export default App;
