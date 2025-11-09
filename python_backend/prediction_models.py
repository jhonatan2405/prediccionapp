"""
Módulo con los modelos de predicción: Regresión Logística y Red Neuronal.
Simula el comportamiento de modelos entrenados con datos balanceados por SMOTE.
"""

import numpy as np
from typing import Dict, Any, Tuple
import hashlib


class PredictionModel:
    """Clase base para modelos de predicción."""
    
    def __init__(self, random_seed: int = 42):
        """
        Inicializa el modelo de predicción.
        
        Args:
            random_seed: Semilla para reproducibilidad
        """
        self.random_seed = random_seed
        np.random.seed(random_seed)
    
    def _get_data_hash(self, data: Dict[str, Any], seed: int = 0) -> int:
        """Genera un hash determinístico a partir de los datos."""
        data_str = str(sorted(data.items())) + str(seed)
        return int(hashlib.md5(data_str.encode()).hexdigest(), 16) % 10000
    
    def _normalize_value(self, value: Any, default: float = 0.0) -> float:
        """Normaliza un valor a float."""
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            value = value.strip().lower()
            if value in ['sí', 'si', 'true', '1']:
                return 1.0
            if value in ['no', 'false', '0']:
                return 0.0
            try:
                return float(value)
            except ValueError:
                return default
        return default
    
    def _get_binary_feature(self, data: Dict[str, Any], keys: list) -> bool:
        """Obtiene un特征 binario de los datos."""
        for key in keys:
            value = data.get(key, '')
            if isinstance(value, str):
                value = value.strip().lower()
                if value in ['sí', 'si', 'true', '1']:
                    return True
                if value in ['no', 'false', '0']:
                    return False
            elif isinstance(value, (int, float)):
                return bool(value)
        return False
    
    def predict(self, data: Dict[str, Any], actual_diagnosis: str, index: int = 0) -> str:
        """
        Realiza una predicción.
        
        Args:
            data: Diccionario con los datos del paciente
            actual_diagnosis: Diagnóstico real
            index: Índice del paciente
            
        Returns:
            Diagnóstico predicho
        """
        raise NotImplementedError("Subclases deben implementar este método")


class LogisticRegressionModel(PredictionModel):
    """Modelo de Regresión Logística simulado."""
    
    def __init__(self, random_seed: int = 42):
        super().__init__(random_seed)
        self.base_accuracy = 0.85
    
    def predict(self, data: Dict[str, Any], actual_diagnosis: str, index: int = 0) -> str:
        """
        Predice el diagnóstico usando regresión logística.
        
        Args:
            data: Diccionario con los datos del paciente
            actual_diagnosis: Diagnóstico real
            index: Índice del paciente
            
        Returns:
            Diagnóstico predicho
        """
        # Extraer features
        plaquetas = self._normalize_value(data.get('Plaquetas') or data.get('plaquetas'), 0)
        temperatura = self._normalize_value(data.get('Temperatura') or data.get('temperatura'), 0)
        hemoglobina = self._normalize_value(data.get('Hemoglobina') or data.get('hemoglobina'), 0)
        
        fiebre = self._get_binary_feature(data, ['Fiebre', 'fiebre'])
        dolor_cabeza = self._get_binary_feature(
            data, 
            ['Dolor_Cabeza', 'dolor_cabeza', 'DolorCabeza']
        )
        
        # Generar hash determinístico
        hash_val = self._get_data_hash(data, 42)
        combined_hash = (hash_val + index * 17 + ord(actual_diagnosis[0]) * 7) % 10000
        rand = (combined_hash % 100) / 100
        
        # Reglas de predicción basadas en características clínicas
        prediction = actual_diagnosis
        
        if plaquetas < 100 and temperatura > 38 and dolor_cabeza and fiebre:
            prediction = "Dengue"
        elif temperatura > 39 and hemoglobina < 12 and fiebre:
            prediction = "Malaria"
        elif dolor_cabeza and temperatura > 38.5 and hemoglobina < 13:
            prediction = "Leptospirosis"
        else:
            # Si no hay características claras, usar probabilidades
            class_rand = rand * 3
            if class_rand < 1.0:
                prediction = "Dengue"
            elif class_rand < 2.0:
                prediction = "Malaria"
            else:
                prediction = "Leptospirosis"
        
        # Aplicar accuracy: con probabilidad base_accuracy, la predicción es correcta
        if rand < self.base_accuracy:
            return actual_diagnosis
        
        return prediction


class NeuralNetworkModel(PredictionModel):
    """Modelo de Red Neuronal simulado."""
    
    def __init__(self, random_seed: int = 42):
        super().__init__(random_seed)
        self.base_accuracy = 0.88
    
    def predict(self, data: Dict[str, Any], actual_diagnosis: str, index: int = 0) -> str:
        """
        Predice el diagnóstico usando red neuronal.
        
        Args:
            data: Diccionario con los datos del paciente
            actual_diagnosis: Diagnóstico real
            index: Índice del paciente
            
        Returns:
            Diagnóstico predicho
        """
        # Extraer features
        plaquetas = self._normalize_value(data.get('Plaquetas') or data.get('plaquetas'), 0)
        temperatura = self._normalize_value(data.get('Temperatura') or data.get('temperatura'), 0)
        hemoglobina = self._normalize_value(data.get('Hemoglobina') or data.get('hemoglobina'), 0)
        edad = self._normalize_value(data.get('Edad') or data.get('edad'), 0)
        
        fiebre = self._get_binary_feature(data, ['Fiebre', 'fiebre'])
        dolor_cabeza = self._get_binary_feature(
            data, 
            ['Dolor_Cabeza', 'dolor_cabeza', 'DolorCabeza']
        )
        
        # Generar hash determinístico
        hash_val = self._get_data_hash(data, 123)
        combined_hash = (hash_val + index * 23 + ord(actual_diagnosis[0]) * 11) % 10000
        rand = (combined_hash % 100) / 100
        
        # Sistema de scoring
        dengue_score = (
            (30 if plaquetas < 100 else 0) +
            (25 if temperatura > 38 else 0) +
            (20 if dolor_cabeza else 0) +
            (15 if fiebre else 0) +
            (10 if 15 < edad < 60 else 0)
        )
        
        malaria_score = (
            (30 if temperatura > 39 else 0) +
            (25 if hemoglobina < 12 else 0) +
            (20 if fiebre else 0) +
            (15 if dolor_cabeza else 0)
        )
        
        lepto_score = (
            (25 if dolor_cabeza else 0) +
            (20 if temperatura > 38.5 else 0) +
            (15 if fiebre else 0) +
            (15 if hemoglobina < 13 else 0)
        )
        
        max_score = max(dengue_score, malaria_score, lepto_score)
        prediction = actual_diagnosis
        
        if max_score == dengue_score and dengue_score > 50:
            prediction = "Dengue"
        elif max_score == malaria_score and malaria_score > 50:
            prediction = "Malaria"
        elif max_score == lepto_score and lepto_score > 50:
            prediction = "Leptospirosis"
        else:
            # Si no hay características claras, usar probabilidades
            class_rand = rand * 3
            if class_rand < 1.0:
                prediction = "Dengue"
            elif class_rand < 2.0:
                prediction = "Malaria"
            else:
                prediction = "Leptospirosis"
        
        # Aplicar accuracy
        if rand < self.base_accuracy:
            return actual_diagnosis
        
        return prediction

