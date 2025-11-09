"""
Módulo para cálculo de métricas de evaluación: accuracy, precision, recall, F1-score,
y matriz de confusión.
"""

import numpy as np
from typing import List, Dict, Tuple
from collections import defaultdict


class MetricsCalculator:
    """Clase para calcular métricas de evaluación de modelos."""
    
    def __init__(self, class_labels: List[str]):
        """
        Inicializa el calculador de métricas.
        
        Args:
            class_labels: Lista de etiquetas de clase
        """
        self.class_labels = class_labels
        self.num_classes = len(class_labels)
        self.class_to_index = {label: idx for idx, label in enumerate(class_labels)}
    
    def build_confusion_matrix(
        self,
        actual: List[str],
        predicted: List[str]
    ) -> np.ndarray:
        """
        Construye la matriz de confusión.
        
        Args:
            actual: Lista de diagnósticos reales
            predicted: Lista de diagnósticos predichos
            
        Returns:
            Matriz de confusión (numpy array)
        """
        confusion_matrix = np.zeros((self.num_classes, self.num_classes), dtype=int)
        
        for actual_label, predicted_label in zip(actual, predicted):
            if actual_label in self.class_to_index and predicted_label in self.class_to_index:
                actual_idx = self.class_to_index[actual_label]
                predicted_idx = self.class_to_index[predicted_label]
                confusion_matrix[actual_idx][predicted_idx] += 1
        
        return confusion_matrix
    
    def calculate_accuracy(self, confusion_matrix: np.ndarray) -> float:
        """
        Calcula la accuracy (exactitud).
        
        Args:
            confusion_matrix: Matriz de confusión
            
        Returns:
            Accuracy como porcentaje
        """
        total = np.sum(confusion_matrix)
        if total == 0:
            return 0.0
        
        correct = np.trace(confusion_matrix)
        return (correct / total) * 100
    
    def calculate_precision(self, confusion_matrix: np.ndarray) -> float:
        """
        Calcula la precisión promedio.
        
        Args:
            confusion_matrix: Matriz de confusión
            
        Returns:
            Precisión promedio como porcentaje
        """
        precisions = []
        
        for i in range(self.num_classes):
            tp = confusion_matrix[i, i]
            fp = np.sum(confusion_matrix[:, i]) - tp
            
            if tp + fp > 0:
                precision = tp / (tp + fp)
                precisions.append(precision)
        
        if not precisions:
            return 0.0
        
        return (np.mean(precisions) * 100)
    
    def calculate_recall(self, confusion_matrix: np.ndarray) -> float:
        """
        Calcula el recall (sensibilidad) promedio.
        
        Args:
            confusion_matrix: Matriz de confusión
            
        Returns:
            Recall promedio como porcentaje
        """
        recalls = []
        
        for i in range(self.num_classes):
            tp = confusion_matrix[i, i]
            fn = np.sum(confusion_matrix[i, :]) - tp
            
            if tp + fn > 0:
                recall = tp / (tp + fn)
                recalls.append(recall)
        
        if not recalls:
            return 0.0
        
        return (np.mean(recalls) * 100)
    
    def calculate_f1_score(
        self,
        precision: float,
        recall: float
    ) -> float:
        """
        Calcula el F1-score.
        
        Args:
            precision: Precisión
            recall: Recall
            
        Returns:
            F1-score
        """
        if precision + recall == 0:
            return 0.0
        
        return (2 * precision * recall) / (precision + recall)
    
    def calculate_all_metrics(
        self,
        actual: List[str],
        predicted: List[str]
    ) -> Dict[str, float]:
        """
        Calcula todas las métricas de evaluación.
        
        Args:
            actual: Lista de diagnósticos reales
            predicted: Lista de diagnósticos predichos
            
        Returns:
            Diccionario con todas las métricas
        """
        confusion_matrix = self.build_confusion_matrix(actual, predicted)
        
        accuracy = self.calculate_accuracy(confusion_matrix)
        precision = self.calculate_precision(confusion_matrix)
        recall = self.calculate_recall(confusion_matrix)
        f1_score = self.calculate_f1_score(precision, recall)
        
        return {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1_score,
            'confusion_matrix': confusion_matrix.tolist()
        }
    
    def get_class_metrics(
        self,
        confusion_matrix: np.ndarray,
        class_label: str
    ) -> Dict[str, float]:
        """
        Obtiene métricas específicas para una clase.
        
        Args:
            confusion_matrix: Matriz de confusión
            class_label: Etiqueta de la clase
            
        Returns:
            Diccionario con métricas de la clase
        """
        if class_label not in self.class_to_index:
            return {}
        
        idx = self.class_to_index[class_label]
        
        tp = confusion_matrix[idx, idx]
        fp = np.sum(confusion_matrix[:, idx]) - tp
        fn = np.sum(confusion_matrix[idx, :]) - tp
        tn = np.sum(confusion_matrix) - tp - fp - fn
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = self.calculate_f1_score(precision * 100, recall * 100)
        
        return {
            'precision': precision * 100,
            'recall': recall * 100,
            'f1_score': f1,
            'true_positives': int(tp),
            'false_positives': int(fp),
            'false_negatives': int(fn),
            'true_negatives': int(tn)
        }
    
    def print_confusion_matrix(self, confusion_matrix: np.ndarray):
        """
        Imprime la matriz de confusión de forma legible.
        
        Args:
            confusion_matrix: Matriz de confusión
        """
        print("\n" + "=" * 60)
        print("MATRIZ DE CONFUSIÓN")
        print("=" * 60)
        print(f"\n{'Actual \\ Predicho':<20}", end="")
        for label in self.class_labels:
            print(f"{label:<15}", end="")
        print()
        print("-" * 60)
        
        for i, actual_label in enumerate(self.class_labels):
            print(f"{actual_label:<20}", end="")
            for j in range(self.num_classes):
                print(f"{confusion_matrix[i, j]:<15}", end="")
            print()
        print("=" * 60)

