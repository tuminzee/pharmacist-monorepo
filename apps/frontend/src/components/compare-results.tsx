import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
// import {
//   processedImageResultAtom,
//   editedPrescriptionAtom,
// } from "@/config/state";

export default function CompareResult() {
  // const [processedImage] = useAtom(processedImageResultAtom);
  // const [editedPrescription] = useAtom(editedPrescriptionAtom);

  // TODO: Calculate the extraction accuracy percentage
  const editedScore = 1;
  const processedScore = 1;

  const chartData = [
    {
      type: "processed",
      score: processedScore * 100,
      fill: "hsl(var(--chart-1))",
    },
    { type: "edited", score: editedScore * 100, fill: "hsl(var(--chart-2))" },
  ];

  const chartConfig = {
    score: {
      label: "Extraction Precision Score",
    },
  } satisfies ChartConfig;

  const percentageDiff = ((editedScore - processedScore) * 100).toFixed(1);
  const isImprovement = editedScore > processedScore;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Data Extraction Analysis</CardTitle>
        <CardDescription>AI vs Manual Data Extraction</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="score" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {Math.abs(Number(percentageDiff))}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Difference
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {isImprovement ? (
            <>
              Improved by {percentageDiff}%{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Decreased by {Math.abs(Number(percentageDiff))}%{" "}
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {isImprovement
            ? "Manual edits improved data extraction accuracy"
            : "AI extraction had better accuracy"}
        </div>
      </CardFooter>
    </Card>
  );
}
