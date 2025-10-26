"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface MetricsDisplayProps {
  metrics: {
    accuracy: number
    precision: number
    recall: number
    f1Score: number
  }
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const metricsData = [
    {
      name: "Accuracy",
      value: metrics.accuracy,
      description: "Porcentaje de predicciones correctas",
      color: "bg-blue-500",
    },
    {
      name: "Precision",
      value: metrics.precision,
      description: "Proporción de positivos correctos",
      color: "bg-green-500",
    },
    {
      name: "Recall",
      value: metrics.recall,
      description: "Proporción de positivos detectados",
      color: "bg-purple-500",
    },
    {
      name: "F1-Score",
      value: metrics.f1Score,
      description: "Media armónica de precision y recall",
      color: "bg-orange-500",
    },
  ]

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Métricas de Rendimiento</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Evaluación del modelo de predicción</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {metricsData.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm sm:text-base">{metric.name}</span>
                <span className="text-xl sm:text-2xl font-bold">{metric.value.toFixed(2)}%</span>
              </div>
              <Progress value={metric.value} className="h-2 sm:h-3" />
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
