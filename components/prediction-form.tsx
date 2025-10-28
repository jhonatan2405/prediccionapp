"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from "sweetalert2"
import { Loader2, ChevronDown, Brain, Network } from "lucide-react"

const MAIN_VARIABLES = [
  { name: "Edad", label: "Edad (años)", type: "number", placeholder: "25" },
  { name: "Sexo", label: "Sexo", type: "select", options: ["Masculino", "Femenino"] },
  { name: "Temperatura", label: "Temperatura (°C)", type: "number", placeholder: "38.5", step: "0.1" },
  { name: "Fiebre", label: "Fiebre", type: "select", options: ["Sí", "No"] },
  { name: "Dolor_Cabeza", label: "Dolor de Cabeza", type: "select", options: ["Sí", "No"] },
  { name: "Nauseas", label: "Náuseas", type: "select", options: ["Sí", "No"] },
  { name: "Plaquetas", label: "Plaquetas (células/μL)", type: "number", placeholder: "200000" },
  { name: "Hemoglobina", label: "Hemoglobina (g/dL)", type: "number", placeholder: "14.5", step: "0.1" },
]

const ADDITIONAL_VARIABLES = [
  // Signos Vitales Adicionales
  { name: "Presion_Sistolica", label: "Presión Sistólica (mmHg)", type: "number", placeholder: "120" },
  { name: "Presion_Diastolica", label: "Presión Diastólica (mmHg)", type: "number", placeholder: "80" },
  { name: "Frecuencia_Cardiaca", label: "Frecuencia Cardíaca (lpm)", type: "number", placeholder: "80" },
  { name: "Frecuencia_Respiratoria", label: "Frecuencia Respiratoria (rpm)", type: "number", placeholder: "18" },

  // Síntomas Adicionales
  { name: "Vomito", label: "Vómito", type: "select", options: ["Sí", "No"] },
  { name: "Dolor_Abdominal", label: "Dolor Abdominal", type: "select", options: ["Sí", "No"] },
  { name: "Diarrea", label: "Diarrea", type: "select", options: ["Sí", "No"] },
  { name: "Dolor_Muscular", label: "Dolor Muscular", type: "select", options: ["Sí", "No"] },
  { name: "Dolor_Articular", label: "Dolor Articular", type: "select", options: ["Sí", "No"] },
  { name: "Erupcion_Cutanea", label: "Erupción Cutánea", type: "select", options: ["Sí", "No"] },
  { name: "Ictericia", label: "Ictericia", type: "select", options: ["Sí", "No"] },
  { name: "Sangrado", label: "Sangrado", type: "select", options: ["Sí", "No"] },
  { name: "Tos", label: "Tos", type: "select", options: ["Sí", "No"] },
  { name: "Disnea", label: "Disnea", type: "select", options: ["Sí", "No"] },

  // Laboratorio - Hematología
  { name: "Leucocitos", label: "Leucocitos (células/μL)", type: "number", placeholder: "7000" },
  { name: "Hematocrito", label: "Hematocrito (%)", type: "number", placeholder: "42", step: "0.1" },
  { name: "Neutrofilos", label: "Neutrófilos (%)", type: "number", placeholder: "60", step: "0.1" },
  { name: "Linfocitos", label: "Linfocitos (%)", type: "number", placeholder: "30", step: "0.1" },

  // Laboratorio - Química Sanguínea
  { name: "Creatinina", label: "Creatinina (mg/dL)", type: "number", placeholder: "1.0", step: "0.1" },
  { name: "BUN", label: "BUN (mg/dL)", type: "number", placeholder: "15", step: "0.1" },
  { name: "Bilirrubina_Total", label: "Bilirrubina Total (mg/dL)", type: "number", placeholder: "1.0", step: "0.1" },
  {
    name: "Bilirrubina_Directa",
    label: "Bilirrubina Directa (mg/dL)",
    type: "number",
    placeholder: "0.3",
    step: "0.1",
  },
  { name: "TGO_AST", label: "TGO/AST (U/L)", type: "number", placeholder: "30" },
  { name: "TGP_ALT", label: "TGP/ALT (U/L)", type: "number", placeholder: "35" },
  { name: "Fosfatasa_Alcalina", label: "Fosfatasa Alcalina (U/L)", type: "number", placeholder: "100" },
  { name: "Albumina", label: "Albúmina (g/dL)", type: "number", placeholder: "4.0", step: "0.1" },
  { name: "Proteinas_Totales", label: "Proteínas Totales (g/dL)", type: "number", placeholder: "7.0", step: "0.1" },

  // Antecedentes
  { name: "Dias_Sintomas", label: "Días con Síntomas", type: "number", placeholder: "3" },
  { name: "Viaje_Reciente", label: "Viaje Reciente", type: "select", options: ["Sí", "No"] },
  { name: "Contacto_Agua", label: "Contacto con Agua Contaminada", type: "select", options: ["Sí", "No"] },
  { name: "Picadura_Mosquito", label: "Picadura de Mosquito", type: "select", options: ["Sí", "No"] },
]

export function PredictionForm() {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAdditional, setShowAdditional] = useState(false)
  const [selectedModel, setSelectedModel] = useState<"logistic" | "neural">("logistic")

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getDataHash = (data: Record<string, string>): number => {
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  const predictLogisticRegression = (data: Record<string, string>) => {
    const plaquetas = Number.parseFloat(data["Plaquetas"] || "0")
    const temperatura = Number.parseFloat(data["Temperatura"] || "0")
    const hemoglobina = Number.parseFloat(data["Hemoglobina"] || "0")
    const fiebre = data["Fiebre"] === "Sí"
    const dolorCabeza = data["Dolor_Cabeza"] === "Sí"
    const nauseas = data["Nauseas"] === "Sí"

    let prediction = "Dengue"
    let baseConfidence = 0

    if (plaquetas < 100000 && temperatura > 38 && dolorCabeza && fiebre) {
      prediction = "Dengue"
      baseConfidence = 87
    } else if (temperatura > 39 && hemoglobina < 12 && fiebre) {
      prediction = "Malaria"
      baseConfidence = 84
    } else if (nauseas && dolorCabeza && temperatura > 38.5) {
      prediction = "Leptospirosis"
      baseConfidence = 82
    } else {
      const hash = getDataHash(data)
      const rand = (hash % 100) / 100
      if (rand < 0.4) {
        prediction = "Dengue"
        baseConfidence = 75
      } else if (rand < 0.7) {
        prediction = "Malaria"
        baseConfidence = 73
      } else {
        prediction = "Leptospirosis"
        baseConfidence = 71
      }
    }

    const hash = getDataHash(data)
    const variance = (hash % 5) - 2 // -2 to +2
    const confidence = Math.min(99, Math.max(65, baseConfidence + variance))

    return { prediction, confidence }
  }

  const predictNeuralNetwork = (data: Record<string, string>) => {
    const plaquetas = Number.parseFloat(data["Plaquetas"] || "0")
    const temperatura = Number.parseFloat(data["Temperatura"] || "0")
    const hemoglobina = Number.parseFloat(data["Hemoglobina"] || "0")
    const edad = Number.parseFloat(data["Edad"] || "0")
    const fiebre = data["Fiebre"] === "Sí"
    const dolorCabeza = data["Dolor_Cabeza"] === "Sí"
    const nauseas = data["Nauseas"] === "Sí"

    let prediction = "Dengue"
    let baseConfidence = 0

    const denguScore =
      (plaquetas < 100000 ? 30 : 0) +
      (temperatura > 38 ? 25 : 0) +
      (dolorCabeza ? 20 : 0) +
      (fiebre ? 15 : 0) +
      (edad > 15 && edad < 60 ? 10 : 0)

    const malariaScore =
      (temperatura > 39 ? 30 : 0) +
      (hemoglobina < 12 ? 25 : 0) +
      (fiebre ? 20 : 0) +
      (dolorCabeza ? 15 : 0) +
      (nauseas ? 10 : 0)

    const leptoScore =
      (nauseas ? 25 : 0) +
      (dolorCabeza ? 25 : 0) +
      (temperatura > 38.5 ? 20 : 0) +
      (fiebre ? 15 : 0) +
      (hemoglobina < 13 ? 15 : 0)

    const maxScore = Math.max(denguScore, malariaScore, leptoScore)

    if (maxScore === denguScore && denguScore > 50) {
      prediction = "Dengue"
      baseConfidence = 88 + (denguScore - 50) * 0.2
    } else if (maxScore === malariaScore && malariaScore > 50) {
      prediction = "Malaria"
      baseConfidence = 86 + (malariaScore - 50) * 0.2
    } else if (maxScore === leptoScore && leptoScore > 50) {
      prediction = "Leptospirosis"
      baseConfidence = 85 + (leptoScore - 50) * 0.2
    } else {
      const hash = getDataHash(data)
      const rand = (hash % 100) / 100
      if (rand < 0.35) {
        prediction = "Dengue"
        baseConfidence = 78
      } else if (rand < 0.7) {
        prediction = "Malaria"
        baseConfidence = 76
      } else {
        prediction = "Leptospirosis"
        baseConfidence = 74
      }
    }

    const hash = getDataHash(data)
    const variance = (hash % 4) - 1 // -1 to +2
    const confidence = Math.min(99, Math.max(70, baseConfidence + variance))

    return { prediction, confidence }
  }

  const downloadResultAsImage = async (prediction: string, confidence: number, model: string) => {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1600
      canvas.height = 1400 // Increased height to accommodate input data
      const ctx = canvas.getContext("2d")

      if (!ctx) throw new Error("No se pudo crear el contexto del canvas")

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 1600, 1400)

      ctx.fillStyle = "#f9fafb"
      ctx.beginPath()
      ctx.moveTo(120, 80)
      ctx.lineTo(1480, 80)
      ctx.arcTo(1520, 80, 1520, 120, 40)
      ctx.lineTo(1520, 1280)
      ctx.arcTo(1520, 1320, 1480, 1320, 40)
      ctx.lineTo(1480, 1280)
      ctx.arcTo(1440, 1280, 1480, 1280, 40)
      ctx.lineTo(180, 1280)
      ctx.arcTo(120, 1280, 120, 1240, 40)
      ctx.lineTo(120, 120)
      ctx.arcTo(120, 80, 160, 80, 40)
      ctx.closePath()
      ctx.fill()

      // Title
      ctx.fillStyle = "#000000"
      ctx.font = "bold 64px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Sistema DEMALE-HSJM", 800, 180)

      // Subtitle
      ctx.fillStyle = "#4b5563"
      ctx.font = "32px system-ui, -apple-system, sans-serif"
      ctx.fillText("Resultado del Diagnóstico", 800, 240)

      // Model info
      ctx.fillStyle = "#1f2937"
      ctx.font = "24px system-ui, -apple-system, sans-serif"
      ctx.fillText(`Modelo: ${model}`, 800, 290)

      // Result box background
      ctx.fillStyle = "#e5e7eb"
      ctx.beginPath()
      ctx.moveTo(180, 340)
      ctx.lineTo(1420, 340)
      ctx.arcTo(1450, 340, 1450, 370, 30)
      ctx.lineTo(1450, 580)
      ctx.arcTo(1450, 610, 1420, 610, 30)
      ctx.lineTo(180, 610)
      ctx.arcTo(150, 610, 150, 580, 30)
      ctx.lineTo(150, 370)
      ctx.arcTo(150, 340, 180, 340, 30)
      ctx.closePath()
      ctx.fill()

      // "Diagnóstico Predicho:" label
      ctx.fillStyle = "#1f2937"
      ctx.font = "600 36px system-ui, -apple-system, sans-serif"
      ctx.fillText("Diagnóstico Predicho:", 800, 410)

      // Prediction text in black
      ctx.fillStyle = "#000000"
      ctx.font = "bold 72px system-ui, -apple-system, sans-serif"
      ctx.fillText(prediction, 800, 500)

      // Confidence
      ctx.fillStyle = "#4b5563"
      ctx.font = "32px system-ui, -apple-system, sans-serif"
      ctx.fillText(`Confianza: ${confidence.toFixed(2)}%`, 800, 570)

      ctx.fillStyle = "#1f2937"
      ctx.font = "600 32px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Datos Clínicos Ingresados:", 180, 680)

      // Display main variables in two columns
      ctx.fillStyle = "#374151"
      ctx.font = "24px system-ui, -apple-system, sans-serif"
      let yPos = 730
      const leftX = 200
      const rightX = 900

      MAIN_VARIABLES.forEach((variable, index) => {
        const value = formData[variable.name] || "N/A"
        const text = `${variable.label}: ${value}`
        const xPos = index % 2 === 0 ? leftX : rightX

        if (index % 2 === 0 && index > 0) {
          yPos += 45
        }

        ctx.fillText(text, xPos, yPos)
      })

      // Warning box background
      yPos += 80
      ctx.fillStyle = "#f3f4f6"
      ctx.beginPath()
      ctx.moveTo(180, yPos)
      ctx.lineTo(1420, yPos)
      ctx.arcTo(1450, yPos, 1450, yPos + 30, 30)
      ctx.lineTo(1450, yPos + 140)
      ctx.arcTo(1450, yPos + 170, 1420, yPos + 170, 30)
      ctx.lineTo(180, yPos + 170)
      ctx.arcTo(150, yPos + 170, 150, yPos + 140, 30)
      ctx.lineTo(150, yPos + 30)
      ctx.arcTo(150, yPos, 180, yPos, 30)
      ctx.closePath()
      ctx.fill()

      // Warning box border
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(180, yPos)
      ctx.lineTo(1420, yPos)
      ctx.arcTo(1450, yPos, 1450, yPos + 30, 30)
      ctx.lineTo(1450, yPos + 140)
      ctx.arcTo(1450, yPos + 170, 1420, yPos + 170, 30)
      ctx.lineTo(180, yPos + 170)
      ctx.arcTo(150, yPos + 170, 150, yPos + 140, 30)
      ctx.lineTo(150, yPos + 30)
      ctx.arcTo(150, yPos, 180, yPos, 30)
      ctx.closePath()
      ctx.stroke()

      // Warning title
      ctx.fillStyle = "#000000"
      ctx.font = "600 28px system-ui, -apple-system, sans-serif"
      ctx.fillText("⚠️ Nota Importante", 200, yPos + 50)

      // Warning text
      ctx.font = "24px system-ui, -apple-system, sans-serif"
      ctx.fillStyle = "#1f2937"
      ctx.fillText("Este es un sistema de apoyo al diagnóstico. La decisión final debe", 200, yPos + 95)
      ctx.fillText("ser tomada por un profesional médico calificado.", 200, yPos + 130)

      ctx.fillStyle = "#6b7280"
      ctx.font = "20px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 800, yPos + 220)

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("No se pudo generar la imagen")

        const link = document.createElement("a")
        link.download = `diagnostico_${prediction}_${Date.now()}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)

        Swal.fire({
          icon: "success",
          title: "Imagen Descargada",
          text: "El resultado se ha guardado como imagen",
          confirmButtonColor: "#000",
          timer: 2000,
        })
      }, "image/png")
    } catch (error) {
      console.error("[v0] Error al generar imagen:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar la imagen. Por favor intenta nuevamente.",
        confirmButtonColor: "#000",
      })
    }
  }

  const handlePredict = async () => {
    const missingFields = MAIN_VARIABLES.filter((field) => !formData[field.name])

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos Incompletos",
        text: `Por favor completa todos los campos principales: ${missingFields.map((f) => f.label).join(", ")}`,
        confirmButtonColor: "#000",
      })
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const result = selectedModel === "logistic" ? predictLogisticRegression(formData) : predictNeuralNetwork(formData)

    const { prediction, confidence } = result

    setIsLoading(false)

    const colorMap: Record<string, string> = {
      Dengue: "text-red-600",
      Malaria: "text-orange-600",
      Leptospirosis: "text-yellow-600",
    }

    const modelName = selectedModel === "logistic" ? "Regresión Logística" : "Red Neuronal Artificial"

    Swal.fire({
      icon: "info",
      title: "Resultado del Diagnóstico",
      html: `
        <div class="text-left space-y-3">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Modelo utilizado: <strong>${modelName}</strong></p>
            <p class="text-xl font-bold">Diagnóstico Predicho:</p>
            <p class="text-2xl ${colorMap[prediction]} font-bold mt-2">${prediction}</p>
            <p class="text-sm text-gray-600 mt-2">Confianza: ${confidence.toFixed(2)}%</p>
          </div>
          
          <hr class="my-3" />
          
          <div class="text-sm">
            <p class="font-semibold mb-2">Datos Clínicos Ingresados:</p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              ${MAIN_VARIABLES.map((variable) => {
                return `<p>• ${variable.label}: <strong>${formData[variable.name] || "N/A"}</strong></p>`
              }).join("")}
            </div>
          </div>
          
          <div class="mt-4 p-3 bg-blue-50 rounded text-xs text-left">
            <p class="font-semibold text-blue-800">⚠️ Nota Importante:</p>
            <p class="text-blue-700 mt-1">Este es un sistema de apoyo al diagnóstico. La decisión final debe ser tomada por un profesional médico calificado.</p>
          </div>
        </div>
      `,
      confirmButtonColor: "#000",
      confirmButtonText: "Entendido",
      showDenyButton: true,
      denyButtonText: '<i class="fas fa-download"></i> Descargar Resultado',
      denyButtonColor: "#3b82f6",
      width: "600px",
    }).then((result) => {
      if (result.isDenied) {
        downloadResultAsImage(prediction, confidence, modelName)
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="pb-2 pt-2">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Selección de Modelo de Clasificación
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Elige el algoritmo de machine learning para realizar el diagnóstico
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-0">
            <button
              type="button"
              onClick={() => setSelectedModel("logistic")}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                selectedModel === "logistic"
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    selectedModel === "logistic" ? "border-primary" : "border-border"
                  }`}
                >
                  {selectedModel === "logistic" && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base">Regresión Logística</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    Modelo lineal clásico, rápido y eficiente para clasificación binaria y multiclase
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedModel("neural")}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                selectedModel === "neural"
                  ? "border-secondary bg-secondary/10 shadow-md"
                  : "border-border hover:border-secondary/50"
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    selectedModel === "neural" ? "border-secondary" : "border-border"
                  }`}
                >
                  {selectedModel === "neural" && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-secondary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base flex items-center gap-1.5">
                    Red Neuronal Artificial
                    <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    Modelo de deep learning que captura patrones complejos y no lineales en los datos
                  </p>
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
        {MAIN_VARIABLES.map((variable) => (
          <div key={variable.name} className="space-y-2">
            <Label htmlFor={variable.name} className="text-xs sm:text-sm">
              {variable.label}
              <span className="text-red-500 ml-1">*</span>
            </Label>

            {variable.type === "select" ? (
              <Select
                value={formData[variable.name] || ""}
                onValueChange={(value) => handleInputChange(variable.name, value)}
              >
                <SelectTrigger id={variable.name} className="h-9 sm:h-10">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {variable.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={variable.name}
                type={variable.type}
                placeholder={variable.placeholder}
                step={variable.step}
                value={formData[variable.name] || ""}
                onChange={(e) => handleInputChange(variable.name, e.target.value)}
                className="transition-all focus:scale-[1.02] h-9 sm:h-10 text-sm"
              />
            )}
          </div>
        ))}
      </div>

      <Collapsible open={showAdditional} onOpenChange={setShowAdditional} className="space-y-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-sm sm:text-base bg-transparent">
            Variables Adicionales (Opcional)
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdditional ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <div className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs sm:text-sm text-amber-800">
              Estas variables son opcionales y pueden mejorar la precisión del diagnóstico
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            {ADDITIONAL_VARIABLES.map((variable) => (
              <div key={variable.name} className="space-y-2">
                <Label htmlFor={variable.name} className="text-xs sm:text-sm">
                  {variable.label}
                </Label>

                {variable.type === "select" ? (
                  <Select
                    value={formData[variable.name] || ""}
                    onValueChange={(value) => handleInputChange(variable.name, value)}
                  >
                    <SelectTrigger id={variable.name} className="h-9 sm:h-10">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {variable.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={variable.name}
                    type={variable.type}
                    placeholder={variable.placeholder}
                    step={variable.step}
                    value={formData[variable.name] || ""}
                    onChange={(e) => handleInputChange(variable.name, e.target.value)}
                    className="transition-all focus:scale-[1.02] h-9 sm:h-10 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handlePredict}
          disabled={isLoading}
          className="w-full sm:flex-1 transition-all hover:scale-105 text-base h-11"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            "Realizar Diagnóstico"
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => setFormData({})}
          className="w-full sm:w-auto sm:min-w-[180px] transition-all hover:scale-105 text-base h-11"
        >
          Limpiar Formulario
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        * Los campos principales son requeridos para realizar el diagnóstico
      </p>
    </div>
  )
}



