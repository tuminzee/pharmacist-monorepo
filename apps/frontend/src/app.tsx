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
import {
  currentStepAtom,
  editedPrescriptionAtom,
  imageAtom,
  processedImageResultAtom,
} from "@/config/state";
import { useAtom, useSetAtom } from "jotai";
import { ProcessResult } from "./components/process-result";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PharmaForm } from "@/components/pharma-form";
import Steps from "rc-steps";
import "rc-steps/assets/index.css";
import CompareResult from "./components/compare-results";

function App() {
  const user = useUser();
  const setImage = useSetAtom(imageAtom);
  const setEditedPrescription = useSetAtom(editedPrescriptionAtom);
  const setProcessedImageResult = useSetAtom(processedImageResultAtom);
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  const handleBack = () => {
    if (currentStep === 3) {
      setEditedPrescription(null);
    } else if (currentStep === 2) {
      setProcessedImageResult(null);
    } else if (currentStep === 1) {
      setImage({ url: "" });
    }
    setCurrentStep(currentStep - 1);
  };

  const renderSteps = () => {
    const steps = [
      {
        title: "Upload",
        status:
          currentStep > 0 ? "finish" : currentStep === 0 ? "process" : "wait",
      },
      {
        title: "Process",
        status:
          currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait",
      },
      {
        title: "Review",
        status:
          currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait",
      },
      {
        title: "Edit",
        status: currentStep === 3 ? "process" : "wait",
      },
      {
        title: "Compare",
        status: currentStep === 4 ? "process" : "wait",
      },
    ];

    return (
      <div className="w-full max-w-4xl mx-auto">
        <Steps
          onChange={(current) => setCurrentStep(current)}
          className="text-muted-foreground"
          current={currentStep}
          items={steps.map((step) => ({
            title: step.title,
            status:
              step.status === "process"
                ? "process"
                : step.status === "finish"
                  ? "finish"
                  : "wait",
          }))}
        />
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
            {currentStep === 1 && "Process Prescription Image"}
            {currentStep === 2 && "Review AI Prescription"}
            {currentStep === 3 && "Edit AI Prescription"}
            {currentStep === 4 && "Compare Prescription Results"}
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
              {currentStep === 3 && <PharmaForm />}
              {currentStep === 4 && <CompareResult />}
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
