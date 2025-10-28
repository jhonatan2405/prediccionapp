# 🏥 DML-Predict AI - Sistema de Diagnóstico Inteligente

## 📋 Descripción
**DML-Predict AI (DEMALE-HSJM)** es un sistema de apoyo al diagnóstico diferencial de enfermedades tropicales que utiliza técnicas de **Machine Learning** para distinguir entre **Dengue, Malaria y Leptospirosis**. Está diseñado como herramienta clínica de apoyo a la decisión, con procesamiento local y enfoque en privacidad.

---

## ✨ Características principales

- 🏥 Diagnóstico diferencial triple: Dengue, Malaria y Leptospirosis
- 🧪 Análisis clínico completo: evalúa 40+ variables clínicas y de laboratorio
- 📊 Diagnóstico individual: formulario paciente a paciente
- 📁 Procesamiento por lotes: carga de archivos Excel / CSV para múltiples registros
- 📈 Métricas de rendimiento: matriz de confusión, Accuracy, Precision, Recall, F1-Score
- 💯 Nivel de confianza: probabilidad/porcentaje asociado a cada predicción
- 📱 Interfaz responsiva: diseño moderno y adaptable a dispositivos móviles
- 🖼️ Exportación de resultados: descarga de diagnósticos como imagen PNG
- 🎨 Tema claro/oscuro: soporte de modo claro y oscuro
- ⚡ Rendimiento optimizado: carga rápida y animaciones fluidas

---


---

## 🤖 Modelos de Clasificación

El sistema ofrece dos algoritmos de machine learning para realizar predicciones:

### 1. Regresión Logística
- **Tipo**: Modelo lineal clásico
- **Características**: Rápido, eficiente y interpretable
- **Uso recomendado**: Casos donde se busca rapidez y simplicidad
- **Ventajas**: Menor complejidad computacional, resultados consistentes

### 2. Red Neuronal Artificial
- **Tipo**: Modelo de deep learning
- **Características**: Captura patrones complejos y no lineales
- **Uso recomendado**: Casos con múltiples variables y relaciones complejas
- **Ventajas**: Mayor capacidad de aprendizaje, mejor manejo de datos complejos

Ambos modelos utilizan las mismas variables clínicas de entrada y proporcionan:
- Diagnóstico predicho (Dengue, Malaria o Leptospirosis)
- Nivel de confianza (porcentaje)
- Resultados determinísticos (mismos datos = mismo resultado)

---

## 🛠️ Tecnologías utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.0.0 | Framework React con App Router y Server Components |
| React | 19.0.0 | Biblioteca UI |
| TypeScript | 5.9.3 | Tipado estático |
| Tailwind CSS | 4.1.16 | Utility-first CSS |


---

## 📁 Estructura del proyecto (resumen)

```text
prediccionapp/
│
├── app/                     # App Router de Next.js (páginas y layout)
├── components/              # Componentes React (UI + componentes de dominio)
│   ├── ui/                  # Librería de componentes base
│   ├── prediction-form.tsx  # Formulario individual
│   └── batch-prediction.tsx # Procesamiento por lotes
├── hooks/                   # Hooks personalizados
├── lib/                     # Utilidades y helpers
├── public/                  # Archivos estáticos (favicon, imágenes)
├── styles/                  # Estilos globales adicionales
├── package.json             # Dependencias y scripts
└── README.md                # Este archivo
```

---

## 🚀 Instalación y puesta en marcha

### Requisitos
- Node.js >= 20.9.0
- Git
- Gestor de paquetes: npm / yarn / pnpm / bun

### Clonar el repositorio

```powershell
git clone https://github.com/jhonatan2405/prediccionapp.git
cd prediccionapp
```

### Instalar dependencias

```powershell
# Con npm
npm install

# Con yarn
yarn install

# Con pnpm
pnpm install

# Con bun
bun install
```

### Ejecutar en modo desarrollo

```powershell
# Con npm
npm run dev

# Con yarn
yarn dev

# Con pnpm
pnpm dev

# Con bun
bun dev
```

Abre http://localhost:3000 en tu navegador.

---

## 💻 Uso de la aplicación

### 🩺 Diagnóstico individual

1. Accede a la pestaña “Individual”.
2. Completa el formulario con los datos del paciente.
   - Variables principales (obligatorias): Edad, Sexo, Temperatura, Fiebre, Dolor de cabeza, Náuseas, Plaquetas, Hemoglobina.
   - Variables adicionales (opcionales): signos vitales, exámenes complementarios, antecedentes.
3. Haz clic en “Realizar diagnóstico”.
4. Revisa: diagnóstico predicho, nivel de confianza (%) y los datos ingresados.
5. (Opcional) Descargar el resultado como PNG.

### 📊 Diagnóstico por lotes

1. Accede a la pestaña “Por Lotes”.
2. Prepara un archivo CSV o XLSX con columnas que incluyan las variables clínicas y una columna de etiqueta/diagnóstico real (ej.: Diagnóstico, Class, Label).
3. Carga el archivo y haz clic en “Procesar archivo”.
4. Revisa el resumen: total procesados, distribución por diagnóstico, tabla por paciente, métricas y matriz de confusión.

---

## 📋 Formato de archivo de entrada (ejemplo)

El archivo debe incluir columnas con las variables relevantes; por ejemplo:

```
Edad,Sexo,Temperatura,Fiebre,Dolor_Cabeza,Nauseas,Plaquetas,Hemoglobina,Diagnóstico
25,Masculino,38.5,Sí,Sí,No,150000,14.5,Dengue
30,Femenino,39.2,Sí,Sí,Sí,180000,13.2,Malaria
```

---

## 📊 Variables clínicas (resumen)

Principales (obligatorias): Edad, Sexo, Temperatura, Fiebre, Dolor de cabeza, Náuseas, Plaquetas, Hemoglobina.

Adicionales (opcionales): presión arterial, frecuencia cardíaca, frecuencia respiratoria, vómito, diarrea, dolor abdominal, erupción, ictericia, leucocitos, creatinina, TGO/TGP, días de síntomas, viaje reciente, contacto con agua contaminada, historial de picaduras, etc.

---

## 🔒 Privacidad y seguridad

- ✅ El procesamiento se realiza en el navegador del cliente.
- ✅ No se almacenan datos de pacientes en servidores por defecto.
- ✅ No se envía información a terceros.
- ✅ Los archivos cargados se procesan localmente.


Si deseas añadir almacenamiento o sincronización en servidor, implementa cifrado y consentimiento explícito conforme a la normativa local antes de guardar datos médicos.

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT — consulta el archivo `LICENSE` para el texto completo.

---

## 🔗 Enlace


[Ir al sitio](https://prediccionapp.vercel.app/)


---

## �‍💻 Autor

Jhonatan Barrera

- GitHub: @jhonatan2405 — https://github.com/jhonatan2405


