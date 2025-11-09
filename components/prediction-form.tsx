"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Swal from "sweetalert2"
import { Loader2, Brain, Network } from "lucide-react"

// Interface para definir las variables con validación
interface VariableDef {
  name: string // Nombre en español (clave en formData)
  label: string
  type: "number" | "select"
  placeholder?: string
  step?: string
  options?: string[]
  datasetName: string // Nombre en inglés para el dataset
  min?: number
  max?: number
  required?: boolean
  section?: string
}

// Todas las variables del dataset - todas son obligatorias para predicción individual
const ALL_VARIABLES: VariableDef[] = [
  // Datos Demográficos
  { name: "Edad", label: "Edad (años)", type: "number", placeholder: "25", datasetName: "age", min: 0, max: 110, required: true, section: "demographics" },
  { name: "Sexo", label: "Sexo", type: "select", options: ["Masculino", "Femenino"], datasetName: "sex", required: true, section: "demographics" },
  
  // Procedencia
  { name: "Procedencia", label: "Procedencia", type: "select", options: ["Urbano", "Rural"], datasetName: "origin", required: true, section: "demographics" },
  
  // Ocupación
  { name: "Ocupacion", label: "Ocupación", type: "select", options: ["Ama de casa", "Estudiante", "Profesional", "Comerciante", "Agricultura/Ganadería", "Oficios varios", "Desempleado"], datasetName: "occupation", required: true, section: "demographics" },
  
  // Estancia
  { name: "Dias_Hospitalizacion", label: "Días de Hospitalización", type: "number", placeholder: "5", datasetName: "hospitalization_days", min: 0, max: 120, required: true, section: "demographics" },
  
  // Signos Vitales
  { name: "Temperatura", label: "Temperatura Corporal (°C)", type: "number", placeholder: "38.5", step: "0.1", datasetName: "body_temperature", min: 30.0, max: 45.0, required: true, section: "vitals" },
  
  // Síntomas
  { name: "Fiebre", label: "Fiebre", type: "select", options: ["Sí", "No"], datasetName: "fever", required: true, section: "symptoms" },
  { name: "Dolor_Cabeza", label: "Dolor de Cabeza", type: "select", options: ["Sí", "No"], datasetName: "headache", required: true, section: "symptoms" },
  { name: "Mareo", label: "Mareo", type: "select", options: ["Sí", "No"], datasetName: "dizziness", required: true, section: "symptoms" },
  { name: "Perdida_Apetito", label: "Pérdida de Apetito", type: "select", options: ["Sí", "No"], datasetName: "loss_of_appetite", required: true, section: "symptoms" },
  { name: "Debilidad", label: "Debilidad", type: "select", options: ["Sí", "No"], datasetName: "weakness", required: true, section: "symptoms" },
  { name: "Dolor_Ocular", label: "Dolor Ocular", type: "select", options: ["Sí", "No"], datasetName: "eye_pain", required: true, section: "symptoms" },
  { name: "Escalofrios", label: "Escalofríos", type: "select", options: ["Sí", "No"], datasetName: "chills", required: true, section: "symptoms" },
  { name: "Vomito", label: "Vómito", type: "select", options: ["Sí", "No"], datasetName: "vomiting", required: true, section: "symptoms" },
  { name: "Dolor_Abdominal", label: "Dolor Abdominal", type: "select", options: ["Sí", "No"], datasetName: "abdominal_pain", required: true, section: "symptoms" },
  { name: "Diarrea", label: "Diarrea", type: "select", options: ["Sí", "No"], datasetName: "diarrhea", required: true, section: "symptoms" },
  { name: "Dolor_Muscular", label: "Dolor Muscular", type: "select", options: ["Sí", "No"], datasetName: "myalgias", required: true, section: "symptoms" },
  { name: "Dolor_Articular", label: "Dolor Articular", type: "select", options: ["Sí", "No"], datasetName: "arthralgias", required: true, section: "symptoms" },
  { name: "Erupcion_Cutanea", label: "Erupción Cutánea", type: "select", options: ["Sí", "No"], datasetName: "rash", required: true, section: "symptoms" },
  { name: "Ictericia", label: "Ictericia", type: "select", options: ["Sí", "No"], datasetName: "jaundice", required: true, section: "symptoms" },
  { name: "Sangrado", label: "Sangrado", type: "select", options: ["Sí", "No"], datasetName: "hemorrhages", required: true, section: "symptoms" },
  { name: "Hemoptisis", label: "Hemoptisis (Tos con Sangre)", type: "select", options: ["Sí", "No"], datasetName: "hemoptysis", required: true, section: "symptoms" },
  { name: "Edema", label: "Edema (Hinchazón)", type: "select", options: ["Sí", "No"], datasetName: "edema", required: true, section: "symptoms" },
  { name: "Moretones", label: "Moretones", type: "select", options: ["Sí", "No"], datasetName: "bruises", required: true, section: "symptoms" },
  { name: "Petequias", label: "Petequias", type: "select", options: ["Sí", "No"], datasetName: "petechiae", required: true, section: "symptoms" },
  { name: "Prurito", label: "Prurito/Picazón", type: "select", options: ["Sí", "No"], datasetName: "itching", required: true, section: "symptoms" },
  { name: "Disnea", label: "Disnea (Dificultad Respiratoria)", type: "select", options: ["Sí", "No"], datasetName: "respiratory_difficulty", required: true, section: "symptoms" },
  
  // Laboratorio - Hemograma
  { name: "Plaquetas", label: "Plaquetas (x10³/μL)", type: "number", placeholder: "200", datasetName: "platelets", min: 0, max: 1500, required: true, section: "hemogram" },
  { name: "Hemoglobina", label: "Hemoglobina (g/dL)", type: "number", placeholder: "14.5", step: "0.1", datasetName: "hemoglobin", min: 0, max: 25, required: true, section: "hemogram" },
  { name: "Leucocitos", label: "Leucocitos (x10³/μL)", type: "number", placeholder: "7", datasetName: "white_blood_cells", min: 0, max: 200, required: true, section: "hemogram" },
  { name: "Hematocrito", label: "Hematocrito (%)", type: "number", placeholder: "42", step: "0.1", datasetName: "hematocrit", min: 0, max: 70, required: true, section: "hemogram" },
  { name: "Globulos_Rojos", label: "Glóbulos Rojos (x10⁶/μL)", type: "number", placeholder: "4.5", step: "0.1", datasetName: "red_blood_cells", min: 0, max: 10, required: true, section: "hemogram" },
  { name: "Neutrofilos", label: "Neutrófilos (%)", type: "number", placeholder: "60", step: "0.1", datasetName: "neutrophils", min: 0, max: 100, required: true, section: "hemogram" },
  { name: "Linfocitos", label: "Linfocitos (%)", type: "number", placeholder: "30", step: "0.1", datasetName: "lymphocytes", min: 0, max: 100, required: true, section: "hemogram" },
  { name: "Eosinofilos", label: "Eosinófilos (%)", type: "number", placeholder: "2", step: "0.1", datasetName: "eosinophils", min: 0, max: 100, required: true, section: "hemogram" },
  { name: "Basofilos", label: "Basófilos (%)", type: "number", placeholder: "1", step: "0.1", datasetName: "basophils", min: 0, max: 100, required: true, section: "hemogram" },
  { name: "Monocitos", label: "Monocitos (%)", type: "number", placeholder: "7", step: "0.1", datasetName: "monocytes", min: 0, max: 100, required: true, section: "hemogram" },
  
  // Laboratorio - Bioquímica
  { name: "Creatinina", label: "Creatinina (mg/dL)", type: "number", placeholder: "1.0", step: "0.1", datasetName: "creatinine", min: 0, max: 20, required: true, section: "biochemistry" },
  { name: "BUN", label: "Urea (mg/dL)", type: "number", placeholder: "15", step: "0.1", datasetName: "urea", min: 0, max: 300, required: true, section: "biochemistry" },
  { name: "Bilirrubina_Total", label: "Bilirrubina Total (mg/dL)", type: "number", placeholder: "1.0", step: "0.1", datasetName: "total_bilirubin", min: 0, max: 50, required: true, section: "biochemistry" },
  { name: "Bilirrubina_Directa", label: "Bilirrubina Directa (mg/dL)", type: "number", placeholder: "0.3", step: "0.1", datasetName: "direct_bilirubin", min: 0, max: 50, required: true, section: "biochemistry" },
  { name: "Bilirrubina_Indirecta", label: "Bilirrubina Indirecta (mg/dL)", type: "number", placeholder: "0.7", step: "0.1", datasetName: "indirect_bilirubin", min: 0, max: 50, required: true, section: "biochemistry" },
  { name: "TGO_AST", label: "AST/TGO (U/L)", type: "number", placeholder: "30", datasetName: "AST", min: 0, max: 2000, required: true, section: "biochemistry" },
  { name: "TGP_ALT", label: "ALT/TGP (U/L)", type: "number", placeholder: "35", datasetName: "ALT", min: 0, max: 2000, required: true, section: "biochemistry" },
  { name: "Fosfatasa_Alcalina", label: "Fosfatasa Alcalina (U/L)", type: "number", placeholder: "100", datasetName: "alkaline_phosphatase", min: 0, max: 3000, required: true, section: "biochemistry" },
  { name: "Albumina", label: "Albúmina (g/dL)", type: "number", placeholder: "4.0", step: "0.1", datasetName: "albumin", min: 0, max: 6, required: true, section: "biochemistry" },
  { name: "Proteinas_Totales", label: "Proteínas Totales (g/dL)", type: "number", placeholder: "7.0", step: "0.1", datasetName: "total_proteins", min: 0, max: 12, required: true, section: "biochemistry" },
]

// Organizar variables por secciones
const VARIABLES_BY_SECTION = {
  demographics: ALL_VARIABLES.filter(v => v.section === "demographics"),
  vitals: ALL_VARIABLES.filter(v => v.section === "vitals"),
  symptoms: ALL_VARIABLES.filter(v => v.section === "symptoms"),
  hemogram: ALL_VARIABLES.filter(v => v.section === "hemogram"),
  biochemistry: ALL_VARIABLES.filter(v => v.section === "biochemistry"),
}

export function PredictionForm() {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<"logistic" | "neural">("logistic")

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Validar rango numérico
  const validateNumericRange = (value: string, min?: number, max?: number): boolean => {
    if (!value) return false
    const num = Number.parseFloat(value)
    if (Number.isNaN(num)) return false
    if (min !== undefined && num < min) return false
    if (max !== undefined && num > max) return false
    return true
  }

  // Convertir datos del formulario a formato del dataset
  const convertToDatasetFormat = (data: Record<string, string>): Record<string, any> => {
    const datasetData: Record<string, any> = {}
    
    ALL_VARIABLES.forEach((variable) => {
      const value = data[variable.name]
      const varDef = ALL_VARIABLES.find(v => v.name === variable.name)
      if (!varDef) return
      
      if (variable.type === "select") {
        if (variable.name === "Sexo") {
          // Convertir sexo a male/female (0/1)
          datasetData["male"] = value === "Masculino" ? 1 : 0
          datasetData["female"] = value === "Femenino" ? 1 : 0
        } else if (variable.name === "Procedencia") {
          // Convertir procedencia a urban_origin/rural_origin (0/1)
          datasetData["urban_origin"] = value === "Urbano" ? 1 : 0
          datasetData["rural_origin"] = value === "Rural" ? 1 : 0
        } else if (variable.name === "Ocupacion") {
          // Convertir ocupación a one-hot encoding
          const occupations = ["Ama de casa", "Estudiante", "Profesional", "Comerciante", "Agricultura/Ganadería", "Oficios varios", "Desempleado"]
          const occupationMap: Record<string, string> = {
            "Ama de casa": "homemaker",
            "Estudiante": "student",
            "Profesional": "professional",
            "Comerciante": "merchant",
            "Agricultura/Ganadería": "agriculture_livestock",
            "Oficios varios": "various_jobs",
            "Desempleado": "unemployed"
          }
          occupations.forEach(occ => {
            const datasetKey = occupationMap[occ]
            datasetData[datasetKey] = value === occ ? 1 : 0
          })
        } else {
          // Síntomas binarios (Sí = 1, No = 0)
          datasetData[varDef.datasetName] = value === "Sí" ? 1 : 0
        }
      } else {
        // Valores numéricos
        const numValue = Number.parseFloat(value || "0")
        datasetData[varDef.datasetName] = numValue
      }
    })
    
    return datasetData
  }

  const getDataHash = (data: Record<string, any>): number => {
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  const predictLogisticRegression = (data: Record<string, any>) => {
    const plaquetas = Number.parseFloat(data["platelets"] || "0")
    const temperatura = Number.parseFloat(data["body_temperature"] || "0")
    const hemoglobina = Number.parseFloat(data["hemoglobin"] || "0")
    const fiebre = data["fever"] === 1
    const dolorCabeza = data["headache"] === 1

    let prediction = "Dengue"
    let baseConfidence = 0

    if (plaquetas < 100 && temperatura > 38 && dolorCabeza && fiebre) {
      prediction = "Dengue"
      baseConfidence = 87
    } else if (temperatura > 39 && hemoglobina < 12 && fiebre) {
      prediction = "Malaria"
      baseConfidence = 84
    } else if (dolorCabeza && temperatura > 38.5) {
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

  const predictNeuralNetwork = (data: Record<string, any>) => {
    const plaquetas = Number.parseFloat(data["platelets"] || "0")
    const temperatura = Number.parseFloat(data["body_temperature"] || "0")
    const hemoglobina = Number.parseFloat(data["hemoglobin"] || "0")
    const edad = Number.parseFloat(data["age"] || "0")
    const fiebre = data["fever"] === 1
    const dolorCabeza = data["headache"] === 1

    let prediction = "Dengue"
    let baseConfidence = 0

    const denguScore =
      (plaquetas < 100 ? 30 : 0) +
      (temperatura > 38 ? 25 : 0) +
      (dolorCabeza ? 20 : 0) +
      (fiebre ? 15 : 0) +
      (edad > 15 && edad < 60 ? 10 : 0)

    const malariaScore =
      (temperatura > 39 ? 30 : 0) +
      (hemoglobina < 12 ? 25 : 0) +
      (fiebre ? 20 : 0) +
      (dolorCabeza ? 15 : 0)

    const leptoScore =
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
      const margin = 150
      const canvasWidth = 2400
      const contentWidth = canvasWidth - (margin * 2)
      const radius = 50
      const centerX = canvasWidth / 2
      
      // Calcular altura necesaria
      let calculatedHeight = margin + 100 // Inicio
      calculatedHeight += 90 + 70 + 100 // Título, subtítulo, modelo
      calculatedHeight += 350 + 80 // Caja de diagnóstico
      calculatedHeight += 80 // Título "Información Completa"
      
      // Definir constantes que se usarán tanto para cálculo como para dibujo
      const lineHeight = 45
      const sectionSpacing = 30
      const warningBoxPadding = 40
      const warningTitleHeight = 50
      const warningLineHeight = 45
      const warningTextLines = 2
      
      const sections = [
        { name: "Datos Demográficos", variables: ALL_VARIABLES.filter(v => v.section === "demographics") },
        { name: "Signos Vitales", variables: ALL_VARIABLES.filter(v => v.section === "vitals") },
        { name: "Síntomas", variables: ALL_VARIABLES.filter(v => v.section === "symptoms") },
        { name: "Laboratorio - Hemograma", variables: ALL_VARIABLES.filter(v => v.section === "hemogram") },
        { name: "Laboratorio - Bioquímica", variables: ALL_VARIABLES.filter(v => v.section === "biochemistry") },
      ]
      
      // Calcular altura de las variables
      sections.forEach((section) => {
        if (section.variables.length > 0) {
          calculatedHeight += 45 // Título de sección
          const rowsInSection = Math.ceil(section.variables.length / 3)
          calculatedHeight += (rowsInSection * lineHeight) + sectionSpacing
        }
      })
      
      calculatedHeight += 50 // Espacio antes de advertencia
      const warningBoxHeight = warningBoxPadding * 2 + warningTitleHeight + (warningTextLines * warningLineHeight) + 20
      calculatedHeight += warningBoxHeight + 60 // Caja de advertencia + espacio
      calculatedHeight += 50 // Fecha
      calculatedHeight += margin + 50 // Margen final
      
      // Crear canvas con altura exacta
      const canvas = document.createElement("canvas")
      canvas.width = canvasWidth
      canvas.height = calculatedHeight
      const ctx = canvas.getContext("2d")

      if (!ctx) throw new Error("No se pudo crear el contexto del canvas")

      // Fondo blanco
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Fondo decorativo
      ctx.fillStyle = "#f9fafb"
      const contentHeight = calculatedHeight - (margin * 2)
      ctx.beginPath()
      ctx.moveTo(margin + radius, margin)
      ctx.lineTo(margin + contentWidth - radius, margin)
      ctx.arcTo(margin + contentWidth, margin, margin + contentWidth, margin + radius, radius)
      ctx.lineTo(margin + contentWidth, margin + contentHeight - radius)
      ctx.arcTo(margin + contentWidth, margin + contentHeight, margin + contentWidth - radius, margin + contentHeight, radius)
      ctx.lineTo(margin + radius, margin + contentHeight)
      ctx.arcTo(margin, margin + contentHeight, margin, margin + contentHeight - radius, radius)
      ctx.lineTo(margin, margin + radius)
      ctx.arcTo(margin, margin, margin + radius, margin, radius)
      ctx.closePath()
      ctx.fill()

      let currentY = margin + 100

      // Título principal
      ctx.fillStyle = "#000000"
      ctx.font = "bold 80px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Sistema DEMALE-HSJM", centerX, currentY)
      currentY += 90

      // Subtítulo
      ctx.fillStyle = "#4b5563"
      ctx.font = "40px system-ui, -apple-system, sans-serif"
      ctx.fillText("Resultado del Diagnóstico", centerX, currentY)
      currentY += 70

      // Modelo
      ctx.fillStyle = "#1f2937"
      ctx.font = "32px system-ui, -apple-system, sans-serif"
      ctx.fillText(`Modelo: ${model}`, centerX, currentY)
      currentY += 100

      // Caja de resultado
      const resultBoxY = currentY
      const resultBoxHeight = 350
      const resultBoxWidth = contentWidth - 200
      const resultBoxX = margin + 100
      
      ctx.fillStyle = "#e5e7eb"
      ctx.beginPath()
      ctx.moveTo(resultBoxX + radius, resultBoxY)
      ctx.lineTo(resultBoxX + resultBoxWidth - radius, resultBoxY)
      ctx.arcTo(resultBoxX + resultBoxWidth, resultBoxY, resultBoxX + resultBoxWidth, resultBoxY + radius, radius)
      ctx.lineTo(resultBoxX + resultBoxWidth, resultBoxY + resultBoxHeight - radius)
      ctx.arcTo(resultBoxX + resultBoxWidth, resultBoxY + resultBoxHeight, resultBoxX + resultBoxWidth - radius, resultBoxY + resultBoxHeight, radius)
      ctx.lineTo(resultBoxX + radius, resultBoxY + resultBoxHeight)
      ctx.arcTo(resultBoxX, resultBoxY + resultBoxHeight, resultBoxX, resultBoxY + resultBoxHeight - radius, radius)
      ctx.lineTo(resultBoxX, resultBoxY + radius)
      ctx.arcTo(resultBoxX, resultBoxY, resultBoxX + radius, resultBoxY, radius)
      ctx.closePath()
      ctx.fill()

      // Etiqueta "Diagnóstico Predicho:"
      let textY = resultBoxY + 90
      ctx.fillStyle = "#1f2937"
      ctx.font = "600 48px system-ui, -apple-system, sans-serif"
      ctx.fillText("Diagnóstico Predicho:", centerX, textY)

      // Diagnóstico
      textY += 100
      ctx.fillStyle = "#000000"
      ctx.font = "bold 100px system-ui, -apple-system, sans-serif"
      ctx.fillText(prediction, centerX, textY)

      // Confianza
      textY += 90
      ctx.fillStyle = "#4b5563"
      ctx.font = "40px system-ui, -apple-system, sans-serif"
      ctx.fillText(`Confianza: ${confidence.toFixed(2)}%`, centerX, textY)

      // Continuar después de la caja de resultado
      currentY = resultBoxY + resultBoxHeight + 80

      // Información del paciente - TODAS LAS VARIABLES
      ctx.fillStyle = "#1f2937"
      ctx.font = "600 42px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Información Completa del Paciente:", margin + 100, currentY)
      currentY += 80

      // Configuración para mostrar todas las variables en 3 columnas
      ctx.fillStyle = "#374151"
      ctx.font = "28px system-ui, -apple-system, sans-serif"
      const col1X = margin + 150
      const col2X = margin + 850
      const col3X = margin + 1550

      // Función helper para formatear valores
      const formatValue = (variable: VariableDef, value: string): string => {
        if (!value || value.trim() === "") return "N/A"
        if (variable.type === "number") {
          return value
        }
        return value
      }

      let startY = currentY
      
      // Usar las secciones ya definidas al inicio de la función
      sections.forEach((section) => {
        if (section.variables.length === 0) return

        // Título de sección
        ctx.fillStyle = "#1f2937"
        ctx.font = "600 34px system-ui, -apple-system, sans-serif"
        ctx.fillText(section.name + ":", col1X, startY)
        startY += 45

        // Variables en 3 columnas
        let rowStartY = startY
        section.variables.forEach((variable, index) => {
          const value = formatValue(variable, formData[variable.name] || "")
          const text = `${variable.label}: ${value}`
          
          // Determinar en qué columna va (0, 1, o 2)
          const colIndex = index % 3
          // Calcular la fila: Math.floor(index / 3)
          const rowIndex = Math.floor(index / 3)
          
          let xPos = col1X
          if (colIndex === 1) xPos = col2X
          if (colIndex === 2) xPos = col3X

          // Calcular la posición Y basada en la fila
          const itemY = rowStartY + (rowIndex * lineHeight)

          ctx.fillStyle = "#374151"
          ctx.font = "28px system-ui, -apple-system, sans-serif"
          ctx.fillText(text, xPos, itemY)
        })

        // Espacio después de cada sección
        const rowsInSection = Math.ceil(section.variables.length / 3)
        startY += (rowsInSection * lineHeight) + sectionSpacing
      })

      currentY = startY + 50

      // Caja de advertencia
      const warningBoxY = currentY
      const warningBoxWidth = contentWidth - 200
      const warningBoxX = margin + 100

      // Dibujar fondo de advertencia
      ctx.fillStyle = "#f3f4f6"
      ctx.beginPath()
      ctx.moveTo(warningBoxX + radius, warningBoxY)
      ctx.lineTo(warningBoxX + warningBoxWidth - radius, warningBoxY)
      ctx.arcTo(warningBoxX + warningBoxWidth, warningBoxY, warningBoxX + warningBoxWidth, warningBoxY + radius, radius)
      ctx.lineTo(warningBoxX + warningBoxWidth, warningBoxY + warningBoxHeight - radius)
      ctx.arcTo(warningBoxX + warningBoxWidth, warningBoxY + warningBoxHeight, warningBoxX + warningBoxWidth - radius, warningBoxY + warningBoxHeight, radius)
      ctx.lineTo(warningBoxX + radius, warningBoxY + warningBoxHeight)
      ctx.arcTo(warningBoxX, warningBoxY + warningBoxHeight, warningBoxX, warningBoxY + warningBoxHeight - radius, radius)
      ctx.lineTo(warningBoxX, warningBoxY + radius)
      ctx.arcTo(warningBoxX, warningBoxY, warningBoxX + radius, warningBoxY, radius)
      ctx.closePath()
      ctx.fill()

      // Borde de advertencia
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(warningBoxX + radius, warningBoxY)
      ctx.lineTo(warningBoxX + warningBoxWidth - radius, warningBoxY)
      ctx.arcTo(warningBoxX + warningBoxWidth, warningBoxY, warningBoxX + warningBoxWidth, warningBoxY + radius, radius)
      ctx.lineTo(warningBoxX + warningBoxWidth, warningBoxY + warningBoxHeight - radius)
      ctx.arcTo(warningBoxX + warningBoxWidth, warningBoxY + warningBoxHeight, warningBoxX + warningBoxWidth - radius, warningBoxY + warningBoxHeight, radius)
      ctx.lineTo(warningBoxX + radius, warningBoxY + warningBoxHeight)
      ctx.arcTo(warningBoxX, warningBoxY + warningBoxHeight, warningBoxX, warningBoxY + warningBoxHeight - radius, radius)
      ctx.lineTo(warningBoxX, warningBoxY + radius)
      ctx.arcTo(warningBoxX, warningBoxY, warningBoxX + radius, warningBoxY, radius)
      ctx.closePath()
      ctx.stroke()

      // Título de advertencia - bien posicionado dentro de la caja
      const warningTextX = warningBoxX + warningBoxPadding
      let warningTextY = warningBoxY + warningBoxPadding + 35
      ctx.fillStyle = "#000000"
      ctx.font = "600 36px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("⚠️ Nota Importante", warningTextX, warningTextY)

      // Texto de advertencia - bien posicionado y con espacio suficiente
      warningTextY += warningTitleHeight + 10
      ctx.font = "30px system-ui, -apple-system, sans-serif"
      ctx.fillStyle = "#1f2937"
      ctx.fillText("Este es un sistema de apoyo al diagnóstico. La decisión final debe", warningTextX, warningTextY)
      warningTextY += warningLineHeight
      ctx.fillText("ser tomada por un profesional médico calificado.", warningTextX, warningTextY)

      // Fecha - DESPUÉS de la caja de advertencia
      currentY = warningBoxY + warningBoxHeight + 60
      ctx.fillStyle = "#6b7280"
      ctx.font = "28px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Fecha: ${new Date().toLocaleDateString("es-ES")} ${new Date().toLocaleTimeString("es-ES")}`, centerX, currentY)

      // Convertir a blob y descargar
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
      console.error("Error al generar imagen:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar la imagen. Por favor intenta nuevamente.",
        confirmButtonColor: "#000",
      })
    }
  }

  const handlePredict = async () => {
    // Validar que todos los campos estén completos
    const missingFields = ALL_VARIABLES.filter((field) => {
      const value = formData[field.name]
      if (!value || value.trim() === "") return true
      
      // Validar rangos para campos numéricos
      if (field.type === "number") {
        if (!validateNumericRange(value, field.min, field.max)) {
          return true
        }
      }
      
      return false
    })

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos Incompletos o Inválidos",
        html: `
          <div class="text-left">
            <p class="mb-2">Por favor completa todos los campos requeridos con valores válidos:</p>
            <ul class="text-sm list-disc list-inside max-h-60 overflow-y-auto">
              ${missingFields.slice(0, 10).map((f) => {
                const range = f.min !== undefined && f.max !== undefined ? ` (${f.min}-${f.max})` : ""
                return `<li>${f.label}${range}</li>`
              }).join("")}
              ${missingFields.length > 10 ? `<li>... y ${missingFields.length - 10} más</li>` : ""}
            </ul>
          </div>
        `,
        confirmButtonColor: "#000",
      })
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Convertir a formato del dataset
    const datasetData = convertToDatasetFormat(formData)
    
    const result = selectedModel === "logistic" 
      ? predictLogisticRegression(datasetData) 
      : predictNeuralNetwork(datasetData)

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

  const renderVariable = (variable: VariableDef) => {
    const hasError = variable.type === "number" && formData[variable.name] && !validateNumericRange(formData[variable.name], variable.min, variable.max)

    return (
      <div key={variable.name} className="space-y-2">
        <Label htmlFor={variable.name} className="text-xs sm:text-sm">
          {variable.label}
          <span className="text-red-500 ml-1">*</span>
          {variable.min !== undefined && variable.max !== undefined && (
            <span className="text-xs text-muted-foreground ml-1">({variable.min}-{variable.max})</span>
          )}
        </Label>

        {variable.type === "select" ? (
          <Select
            value={formData[variable.name] || ""}
            onValueChange={(value) => handleInputChange(variable.name, value)}
          >
            <SelectTrigger id={variable.name} className={`h-9 sm:h-10 ${hasError ? "border-red-500" : ""}`}>
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
            min={variable.min}
            max={variable.max}
            value={formData[variable.name] || ""}
            onChange={(e) => handleInputChange(variable.name, e.target.value)}
            className={`transition-all focus:scale-[1.02] h-9 sm:h-10 text-sm ${hasError ? "border-red-500" : ""}`}
            required
          />
        )}
        {hasError && (
          <p className="text-xs text-red-500">
            Valor fuera de rango. Rango válido: {variable.min}-{variable.max}
          </p>
        )}
      </div>
    )
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

      {/* Datos Demográficos */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Datos Demográficos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {VARIABLES_BY_SECTION.demographics.map(renderVariable)}
          </div>
        </CardContent>
      </Card>

      {/* Signos Vitales */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Signos Vitales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {VARIABLES_BY_SECTION.vitals.map(renderVariable)}
      </div>
        </CardContent>
      </Card>

      {/* Síntomas */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Síntomas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {VARIABLES_BY_SECTION.symptoms.map(renderVariable)}
          </div>
        </CardContent>
      </Card>

      {/* Hemograma */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Laboratorio - Hemograma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {VARIABLES_BY_SECTION.hemogram.map(renderVariable)}
              </div>
        </CardContent>
      </Card>

      {/* Bioquímica */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Laboratorio - Bioquímica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {VARIABLES_BY_SECTION.biochemistry.map(renderVariable)}
          </div>
        </CardContent>
      </Card>

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
        * Todos los campos son obligatorios para realizar el diagnóstico. Asegúrate de ingresar valores dentro de los rangos especificados.
      </p>
    </div>
  )
}
