"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PredictionForm } from "@/components/prediction-form"
import { BatchPrediction } from "@/components/batch-prediction"
import { Activity, FileSpreadsheet, Brain, Database, TrendingUp, Sparkles } from "lucide-react"
import { Preloader } from "@/components/preloader"
import { AnimatedFooter } from "@/components/animated-footer"
import { GithubButton } from "@/components/github-button"

export default function PredictionApp() {
  return (
    <>
      <Preloader />
      <div className="min-h-screen animated-bg bg-gradient-to-br from-primary/5 via-background to-accent/10 animate-page-fade-in">
        <header className="border-b border-border/40 backdrop-blur-md bg-background/70 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center animate-bounce">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    DML-Predict AI
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Diagnóstico Inteligente</p>
                </div>
              </div>
              <GithubButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 md:py-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-10 animate-fade-in">
              <div className="inline-block mb-3 animate-float">
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary shadow-2xl animate-pulse-glow">
                  <Brain className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold leading-normal mb-3 md:mb-4 text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient-shift">
                Diagnóstico Inteligente
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                Tecnología de machine learning avanzada para el diagnóstico diferencial de enfermedades tropicales
              </p>
            </div>

            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 md:mb-8 h-auto shadow-lg">
                <TabsTrigger
                  value="individual"
                  className="gap-2 text-xs md:text-sm py-2 md:py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent"
                >
                  <Activity className="w-4 h-4" />
                  Individual
                </TabsTrigger>
                <TabsTrigger
                  value="batch"
                  className="gap-2 text-xs md:text-sm py-2 md:py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-primary"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Por Lotes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="individual" className="animate-scale-in">
                <Card className="border-border/50 shadow-2xl hover:shadow-3xl transition-all hover:border-primary/30 backdrop-blur-sm bg-card/80">
                  <CardHeader className="pt-4 px-4 md:pt-6 md:px-6">
                    <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl">
                      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                        <Activity className="w-4 h-4 md:w-6 md:h-6 text-primary flex-shrink-0" />
                      </div>
                      <span>Diagnóstico Individual</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-base mt-1 md:mt-2">
                      Ingresa los datos clínicos y de laboratorio del paciente para obtener un diagnóstico diferencial
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <PredictionForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="batch" className="animate-scale-in">
                <Card className="border-border/50 shadow-2xl hover:shadow-3xl transition-all hover:border-secondary/30 backdrop-blur-sm bg-card/80">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl">
                      <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10">
                        <FileSpreadsheet className="w-4 h-4 md:w-6 md:h-6 text-secondary flex-shrink-0" />
                      </div>
                      <span>Diagnóstico por Lotes</span>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-base mt-1 md:mt-2">
                      Carga un archivo Excel para evaluar múltiples pacientes y obtener métricas de rendimiento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <BatchPrediction />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
              <Card className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-slide-in-left backdrop-blur-sm bg-card/80 group">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Database className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <CardTitle className="text-base md:text-lg">Recolección de Datos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    El sistema recopila variables clínicas incluyendo datos sociodemográficos, signos vitales, síntomas
                    específicos y resultados de laboratorio del paciente.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in backdrop-blur-sm bg-card/80 group"
                style={{ animationDelay: "0.15s" }}
              >
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                      <Brain className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <CardTitle className="text-base md:text-lg">Análisis con IA</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Un modelo de aprendizaje automático entrenado procesa los datos y analiza patrones complejos para
                    diferenciar entre Dengue, Malaria y Leptospirosis.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-slide-in-right backdrop-blur-sm bg-card/80 group">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 text-accent group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <CardTitle className="text-base md:text-lg">Resultado y Confianza</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    El sistema genera un diagnóstico diferencial con nivel de confianza y métricas de rendimiento,
                    apoyando la toma de decisiones clínicas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <AnimatedFooter />
      </div>
    </>
  )
}



