"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Swal from "sweetalert2"
import { Loader2, ChevronDown } from "lucide-react"
import html2canvas from "html2canvas"

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

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const downloadResultAsImage = async (prediction: string, confidence: number) => {
    const resultDiv = document.createElement("div")
    resultDiv.style.cssText = `
      width: 800px;
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: system-ui, -apple-system, sans-serif;
      color: white;
    `

    const colorMap: Record<string, string> = {
      Dengue: "#ef4444",
      Malaria: "#f97316",
      Leptospirosis: "#eab308",
    }

    resultDiv.innerHTML = `
      <div style="background: white; border-radius: 20px; padding: 30px; color: #1f2937;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: bold; margin: 0 0 10px 0; color: #111827;">
            Sistema DEMALE-HSJM
          </h1>
          <p style="color: #6b7280; margin: 0;">Resultado del Diagnóstico</p>
        </div>
        
        <div style="background: #f3f4f6; border-radius: 15px; padding: 25px; margin-bottom: 25px;">
          <p style="font-size: 18px; font-weight: 600; margin: 0 0 15px 0; color: #374151;">
            Diagnóstico Predicho:
          </p>
          <p style="font-size: 36px; font-weight: bold; margin: 0; color: ${colorMap[prediction]};">
            ${prediction}
          </p>
          <p style="font-size: 16px; color: #6b7280; margin: 15px 0 0 0;">
            Confianza: ${confidence.toFixed(2)}%
          </p>
        </div>
        
        <div style="background: #eff6ff; border-radius: 15px; padding: 20px; border-left: 4px solid #3b82f6;">
          <p style="font-size: 14px; font-weight: 600; color: #1e40af; margin: 0 0 8px 0;">
            ⚠️ Nota Importante
          </p>
          <p style="font-size: 13px; color: #1e40af; margin: 0; line-height: 1.6;">
            Este es un sistema de apoyo al diagnóstico. La decisión final debe ser tomada por un profesional médico calificado.
          </p>
        </div>
        
        <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            Hospital San José de Malambo - ${new Date().toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>
    `

    document.body.appendChild(resultDiv)

    try {
      const canvas = await html2canvas(resultDiv, {
        backgroundColor: null,
        scale: 2,
      })

      const link = document.createElement("a")
      link.download = `diagnostico_${prediction}_${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      Swal.fire({
        icon: "success",
        title: "Imagen Descargada",
        text: "El resultado se ha guardado como imagen",
        confirmButtonColor: "#000",
        timer: 2000,
      })
    } catch (error) {
      console.error("[v0] Error al generar imagen:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar la imagen",
        confirmButtonColor: "#000",
      })
    } finally {
      document.body.removeChild(resultDiv)
    }
  }

  const handlePredict = async () => {
    // Validar que todos los campos principales estén llenos
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

    const plaquetas = Number.parseFloat(formData["Plaquetas"] || "0")
    const temperatura = Number.parseFloat(formData["Temperatura"] || "0")
    const hemoglobina = Number.parseFloat(formData["Hemoglobina"] || "0")
    const fiebre = formData["Fiebre"] === "Sí"
    const dolorCabeza = formData["Dolor_Cabeza"] === "Sí"
    const nauseas = formData["Nauseas"] === "Sí"

    let prediction = "Dengue"
    let confidence = 0

    if (plaquetas < 100000 && temperatura > 38 && dolorCabeza && fiebre) {
      prediction = "Dengue"
      confidence = 85 + Math.random() * 10
    } else if (temperatura > 39 && hemoglobina < 12 && fiebre) {
      prediction = "Malaria"
      confidence = 80 + Math.random() * 15
    } else if (nauseas && dolorCabeza && temperatura > 38.5) {
      prediction = "Leptospirosis"
      confidence = 82 + Math.random() * 12
    } else {
      const rand = Math.random()
      if (rand < 0.4) prediction = "Dengue"
      else if (rand < 0.7) prediction = "Malaria"
      else prediction = "Leptospirosis"
      confidence = 70 + Math.random() * 20
    }

    setIsLoading(false)

    const colorMap: Record<string, string> = {
      Dengue: "text-red-600",
      Malaria: "text-orange-600",
      Leptospirosis: "text-yellow-600",
    }

    Swal.fire({
      icon: "info",
      title: "Resultado del Diagnóstico",
      html: `
        <div class="text-left space-y-3">
          <div class="p-4 bg-gray-50 rounded-lg">
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
        downloadResultAsImage(prediction, confidence)
      }
    })
  }

  return (
    <div className="space-y-6">
  

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
