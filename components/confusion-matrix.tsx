"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfusionMatrixProps {
  matrix: number[][]
  classLabels?: string[]
}

export function ConfusionMatrix({ matrix, classLabels = ["Positivo", "Negativo"] }: ConfusionMatrixProps) {
  const isMulticlass = matrix.length === 3

  if (isMulticlass) {
    return (
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Matriz de Confusión</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Visualización de diagnósticos correctos e incorrectos para {classLabels.join(", ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="inline-block min-w-full px-2 sm:px-0">
              <div className="grid grid-cols-4 gap-1 sm:gap-2 max-w-2xl mx-auto text-xs sm:text-sm">
                {/* Header */}
                <div></div>
                {classLabels.map((label) => (
                  <div key={`header-${label}`} className="text-center font-semibold p-1 sm:p-2">
                    <span className="hidden sm:inline">Pred. {label}</span>
                    <span className="sm:hidden">{label.slice(0, 4)}.</span>
                  </div>
                ))}

                {/* Rows */}
                {matrix.map((row, rowIdx) => (
                  <>
                    <div
                      key={`label-${rowIdx}`}
                      className="font-semibold p-1 sm:p-2 flex items-center text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Real {classLabels[rowIdx]}</span>
                      <span className="sm:hidden">{classLabels[rowIdx].slice(0, 4)}.</span>
                    </div>
                    {row.map((value, colIdx) => {
                      const isCorrect = rowIdx === colIdx
                      return (
                        <div
                          key={`cell-${rowIdx}-${colIdx}`}
                          className={`${
                            isCorrect
                              ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                              : "bg-red-100 dark:bg-red-900/30 border-2 border-red-500"
                          } rounded-lg p-2 sm:p-4 text-center transition-all hover:scale-105`}
                        >
                          <div
                            className={`text-lg sm:text-2xl font-bold ${
                              isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                            }`}
                          >
                            {value}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">
                            {isCorrect ? "Correcto" : "Error"}
                          </div>
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded flex-shrink-0"></div>
                  <span>Predicciones Correctas</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded flex-shrink-0"></div>
                  <span>Predicciones Incorrectas</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Matriz 2x2 para clasificación binaria (código original)
  const [[tp, fp], [fn, tn]] = matrix

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriz de Confusión</CardTitle>
        <CardDescription>Visualización de predicciones correctas e incorrectas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
              {/* Header */}
              <div></div>
              <div className="text-center font-semibold text-sm p-2">Predicho Positivo</div>
              <div className="text-center font-semibold text-sm p-2">Predicho Negativo</div>

              {/* Row 1 */}
              <div className="font-semibold text-sm p-2 flex items-center">Real Positivo</div>
              <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{tp}</div>
                <div className="text-xs text-muted-foreground mt-1">True Positive</div>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{fn}</div>
                <div className="text-xs text-muted-foreground mt-1">False Negative</div>
              </div>

              {/* Row 2 */}
              <div className="font-semibold text-sm p-2 flex items-center">Real Negativo</div>
              <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{fp}</div>
                <div className="text-xs text-muted-foreground mt-1">False Positive</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{tn}</div>
                <div className="text-xs text-muted-foreground mt-1">True Negative</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
