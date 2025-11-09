"""
Archivo principal para procesamiento de predicción por lotes.
Integra todos los módulos: procesamiento de datos, balanceo SMOTE, predicción y métricas.
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
import sys
import os

# Importar módulos locales
from data_processor import DataProcessor
from smote_balancing import SMOTEBalancer
from prediction_models import LogisticRegressionModel, NeuralNetworkModel
from metrics_calculator import MetricsCalculator


class BatchPredictionSystem:
    """Sistema completo de predicción por lotes."""
    
    def __init__(self, model_type: str = "logistic", random_seed: int = 42):
        """
        Inicializa el sistema de predicción.
        
        Args:
            model_type: Tipo de modelo ("logistic" o "neural")
            random_seed: Semilla para reproducibilidad
        """
        self.model_type = model_type
        self.random_seed = random_seed
        
        # Inicializar componentes
        self.data_processor = DataProcessor()
        self.smote_balancer = SMOTEBalancer(random_seed=random_seed)
        
        if model_type == "logistic":
            self.prediction_model = LogisticRegressionModel(random_seed=random_seed)
        elif model_type == "neural":
            self.prediction_model = NeuralNetworkModel(random_seed=random_seed)
        else:
            raise ValueError(f"Tipo de modelo no válido: {model_type}")
        
        self.class_labels = self.data_processor.class_labels
        self.metrics_calculator = MetricsCalculator(self.class_labels)
    
    def process_file(
        self,
        file_path: str,
        diagnosis_column: str = None,
        balance_data: bool = True
    ) -> Dict:
        """
        Procesa un archivo completo y realiza predicciones.
        
        Args:
            file_path: Ruta del archivo CSV o Excel
            diagnosis_column: Nombre de la columna de diagnóstico (opcional)
            balance_data: Si True, aplica balanceo SMOTE
            
        Returns:
            Diccionario con resultados completos
        """
        print(f"\n{'='*60}")
        print(f"PROCESANDO ARCHIVO: {file_path}")
        print(f"Modelo: {'Regresión Logística' if self.model_type == 'logistic' else 'Red Neuronal'}")
        print(f"{'='*60}\n")
        
        # 1. Procesar datos
        print("1. Cargando y procesando datos...")
        df, diagnosis_col, original_counts = self.data_processor.process_data(
            file_path,
            diagnosis_column
        )
        
        print(f"   - Columnas encontradas: {len(df.columns)}")
        print(f"   - Total de registros: {len(df)}")
        print(f"   - Distribución original:")
        for label, count in original_counts.items():
            print(f"     • {label}: {count} pacientes")
        
        # 2. Balancear datos con SMOTE
        if balance_data:
            print("\n2. Aplicando balanceo SMOTE...")
            df_balanced = self.smote_balancer.balance_classes(
                df,
                diagnosis_col,
                self.class_labels
            )
            balanced_counts = df_balanced[diagnosis_col].value_counts().to_dict()
            
            print(f"   - Distribución balanceada:")
            for label in self.class_labels:
                original = original_counts.get(label, 0)
                balanced = balanced_counts.get(label, 0)
                synthetic = balanced - original
                print(f"     • {label}: {balanced} total ({original} reales + {synthetic} sintéticos)")
        else:
            df_balanced = df
            balanced_counts = original_counts
        
        # 3. Realizar predicciones
        print(f"\n3. Realizando predicciones con {self.model_type}...")
        predictions = []
        actual = []
        
        for idx, row in df_balanced.iterrows():
            # Convertir fila a diccionario
            data_dict = row.to_dict()
            actual_diagnosis = data_dict[diagnosis_col]
            
            # Realizar predicción
            predicted = self.prediction_model.predict(
                data_dict,
                actual_diagnosis,
                index=idx
            )
            
            predictions.append(predicted)
            actual.append(actual_diagnosis)
        
        print(f"   - Predicciones completadas: {len(predictions)}")
        
        # 4. Calcular métricas
        print("\n4. Calculando métricas...")
        metrics = self.metrics_calculator.calculate_all_metrics(actual, predictions)
        
        # 5. Preparar resultados
        results = {
            'file_path': file_path,
            'model_type': self.model_type,
            'total_records': len(df_balanced),
            'original_counts': original_counts,
            'balanced_counts': balanced_counts,
            'predictions': predictions,
            'actual': actual,
            'metrics': {
                'accuracy': metrics['accuracy'],
                'precision': metrics['precision'],
                'recall': metrics['recall'],
                'f1_score': metrics['f1_score']
            },
            'confusion_matrix': metrics['confusion_matrix']
        }
        
        # 6. Mostrar resultados
        self._print_results(results)
        
        return results
    
    def _print_results(self, results: Dict):
        """Imprime los resultados de forma legible."""
        print(f"\n{'='*60}")
        print("RESULTADOS")
        print(f"{'='*60}\n")
        
        print(f"Modelo: {'Regresión Logística' if results['model_type'] == 'logistic' else 'Red Neuronal'}")
        print(f"Total de registros procesados: {results['total_records']}")
        print(f"\nMétricas:")
        print(f"  • Accuracy: {results['metrics']['accuracy']:.2f}%")
        print(f"  • Precision: {results['metrics']['precision']:.2f}%")
        print(f"  • Recall: {results['metrics']['recall']:.2f}%")
        print(f"  • F1-Score: {results['metrics']['f1_score']:.2f}%")
        
        # Imprimir matriz de confusión
        confusion_matrix = np.array(results['confusion_matrix'])
        self.metrics_calculator.print_confusion_matrix(confusion_matrix)
        
        print(f"\n{'='*60}\n")
    
    def save_results(self, results: Dict, output_path: str):
        """
        Guarda los resultados en un archivo CSV.
        
        Args:
            results: Diccionario con resultados
            output_path: Ruta del archivo de salida
        """
        # Crear DataFrame con resultados
        data = {
            'Paciente_ID': range(1, len(results['actual']) + 1),
            'Diagnostico_Real': results['actual'],
            'Prediccion': results['predictions']
        }
        
        df_results = pd.DataFrame(data)
        df_results.to_csv(output_path, index=False)
        print(f"\nResultados guardados en: {output_path}")


def main():
    """Función principal."""
    if len(sys.argv) < 2:
        print("Uso: python main.py <archivo.csv> [modelo] [--no-balance]")
        print("  modelo: 'logistic' (default) o 'neural'")
        print("  --no-balance: Desactiva el balanceo SMOTE")
        sys.exit(1)
    
    file_path = sys.argv[1]
    model_type = sys.argv[2] if len(sys.argv) > 2 else "logistic"
    balance_data = "--no-balance" not in sys.argv
    
    if model_type not in ["logistic", "neural"]:
        print(f"Error: Modelo '{model_type}' no válido. Use 'logistic' o 'neural'")
        sys.exit(1)
    
    try:
        # Crear sistema de predicción
        system = BatchPredictionSystem(model_type=model_type)
        
        # Procesar archivo
        results = system.process_file(file_path, balance_data=balance_data)
        
        # Guardar resultados
        output_path = file_path.replace('.csv', '_resultados.csv').replace('.xlsx', '_resultados.csv')
        system.save_results(results, output_path)
        
        print("\n✓ Procesamiento completado exitosamente")
        
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

