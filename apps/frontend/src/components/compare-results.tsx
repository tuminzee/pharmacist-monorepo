import { RadialBar, RadialBarChart, LabelList } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useComparePrescription } from "@/hooks/use-compare-prescription";
import {
  compareResultAtom,
  editedPrescriptionAtom,
  processedImageResultAtom,
} from "@/config/state";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function CompareResult() {
  const processedImage = useAtomValue(processedImageResultAtom);
  const editedPrescription = useAtomValue(editedPrescriptionAtom);
  const { mutate: comparePrescription } = useComparePrescription();
  const compareResults = useAtomValue(compareResultAtom);

  useEffect(() => {
    if (processedImage && editedPrescription) {
      comparePrescription({
        ai: processedImage,
        user: editedPrescription,
      });
    }
  }, [processedImage, editedPrescription, comparePrescription]);

  const processedScore = compareResults?.medicineMatchPercentage ?? 0;
  const editedScore = compareResults?.totalMatchPercentage ?? 0;
  const optionalFieldsScore =
    compareResults?.optionalFieldsMatchPercentage ?? 0;

  const chartData = [
    {
      type: "Medicine",
      score: processedScore,
      fill: "hsl(var(--chart-1))",
    },
    {
      type: "Total",
      score: editedScore,
      fill: "hsl(var(--chart-2))",
    },
    {
      type: "Optional",
      score: optionalFieldsScore,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const chartConfig = {
    score: {
      label: "Match Score",
    },
    Medicine: {
      label: "Medicine Match",
      color: "hsl(var(--chart-1))",
    },
    Total: {
      label: "Total Match",
      color: "hsl(var(--chart-2))",
    },
    Optional: {
      label: "Optional Fields",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Prescription Comparison Analysis</CardTitle>
        <CardDescription>Detailed Match Score Breakdown</CardDescription>
        {compareResults && (
          <div className="mt-4 text-center">
            <div className="text-4xl font-bold">
              {Math.round(compareResults.totalMatchPercentage)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Overall Match Score
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="type" />}
            />
            <RadialBar dataKey="score" background>
              <LabelList
                position="insideStart"
                dataKey="type"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        {compareResults?.details && (
          <>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-2 py-1">
                {compareResults.details.matchingMedicines}/
                {compareResults.details.totalMedicines}
              </Badge>
              <span className="text-sm text-muted-foreground">
                medicines matched
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {compareResults.details.doctorNameMatch && (
                <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                  ✓ Doctor Name
                </Badge>
              )}
              {compareResults.details.dateMatch && (
                <Badge variant="outline" className="text-emerald-500 border-emerald-500">
                  ✓ Date
                </Badge>
              )}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
