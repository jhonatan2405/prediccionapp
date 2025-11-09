"""
Módulo para balanceo de clases usando técnica SMOTE (Synthetic Minority Oversampling Technique)
Genera datos sintéticos para balancear clases desbalanceadas en el dataset.
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Any
import hashlib


class SMOTEBalancer:
    """Clase para balancear clases usando técnica SMOTE simplificada."""
    
    def __init__(self, random_seed: int = 42):
        """
        Inicializa el balanceador SMOTE.
        
        Args:
            random_seed: Semilla para reproducibilidad
        """
        self.random_seed = random_seed
        np.random.seed(random_seed)
    
    def _get_data_hash(self, data: Dict[str, Any], seed: int = 0) -> int:
        """
        Genera un hash determinístico a partir de los datos.
        
        Args:
            data: Diccionario con los datos
            seed: Semilla adicional para variación
            
        Returns:
            Hash entero
        """
        data_str = str(sorted(data.items())) + str(seed)
        return int(hashlib.md5(data_str.encode()).hexdigest(), 16) % 10000
    
    def _is_numeric(self, value: Any) -> bool:
        """
        Determina si un valor es numérico.
        
        Args:
            value: Valor a evaluar
            
        Returns:
            True si es numérico, False en caso contrario
        """
        if isinstance(value, (int, float)):
            return True
        if isinstance(value, str):
            value = value.strip().lower()
            if value in ['sí', 'si', 'no', 'true', 'false', '']:
                return False
            try:
                float(value)
                return True
            except ValueError:
                return False
        return False
    
    def _classify_columns(self, samples: List[Dict[str, Any]]) -> Tuple[List[str], List[str]]:
        """
        Clasifica columnas en numéricas y categóricas.
        
        Args:
            samples: Lista de muestras
            
        Returns:
            Tupla con listas de columnas numéricas y categóricas
        """
        if not samples:
            return [], []
        
        numeric_columns = []
        categorical_columns = []
        
        first_sample = samples[0]
        check_count = min(3, len(samples))
        
        for key in first_sample.keys():
            is_numeric = True
            numeric_count = 0
            
            for j in range(check_count):
                value = samples[j].get(key)
                if not self._is_numeric(value):
                    is_numeric = False
                    break
                numeric_count += 1
            
            if is_numeric and numeric_count > 0:
                numeric_columns.append(key)
            else:
                categorical_columns.append(key)
        
        return numeric_columns, categorical_columns
    
    def generate_synthetic_samples(
        self,
        samples: List[Dict[str, Any]],
        target_count: int,
        seed: int = 0
    ) -> List[Dict[str, Any]]:
        """
        Genera muestras sintéticas usando interpolación (técnica SMOTE simplificada).
        
        Args:
            samples: Lista de muestras originales
            target_count: Cantidad objetivo de muestras
            seed: Semilla para generación
            
        Returns:
            Lista de muestras (originales + sintéticas)
        """
        if not samples:
            return []
        
        if len(samples) >= target_count:
            return samples.copy()
        
        synthetic_samples = samples.copy()
        needed = target_count - len(samples)
        
        # Caso especial: solo una muestra
        if len(samples) == 1:
            single_sample = samples[0]
            for i in range(needed):
                synthetic_row = {}
                for key, value in single_sample.items():
                    hash_val = self._get_data_hash(single_sample, seed + i + ord(key[0]) if key else 0)
                    
                    if self._is_numeric(value):
                        try:
                            num_value = float(value)
                            if num_value != 0:
                                variation = ((hash_val % 10) - 5) / 100  # ±5%
                                synthetic_row[key] = num_value * (1 + variation)
                            else:
                                synthetic_row[key] = value
                        except (ValueError, TypeError):
                            synthetic_row[key] = value
                    else:
                        synthetic_row[key] = value
                
                synthetic_samples.append(synthetic_row)
            
            return synthetic_samples
        
        # Clasificar columnas
        numeric_columns, categorical_columns = self._classify_columns(samples)
        
        # Generar muestras sintéticas
        for i in range(needed):
            # Seleccionar dos muestras diferentes
            hash1 = self._get_data_hash({'index': i, 'seed': seed}, seed + i * 2)
            hash2 = self._get_data_hash({'index': i, 'seed': seed}, seed + i * 2 + 1)
            
            idx1 = hash1 % len(samples)
            idx2 = hash2 % len(samples)
            
            if idx1 == idx2:
                idx2 = (idx2 + 1) % len(samples)
            
            sample1 = samples[idx1]
            sample2 = samples[idx2]
            
            # Factor de interpolación (0.1 a 0.9 para evitar extremos)
            alpha = ((hash1 % 100) / 100) * 0.8 + 0.1
            
            synthetic_row = {}
            
            # Interpolación para columnas numéricas
            for col in numeric_columns:
                try:
                    val1 = float(sample1.get(col, 0) or 0)
                    val2 = float(sample2.get(col, 0) or 0)
                    synthetic_value = val1 + alpha * (val2 - val1)
                    
                    # Redondear apropiadamente
                    if abs(synthetic_value) < 1:
                        synthetic_row[col] = round(synthetic_value, 2)
                    else:
                        synthetic_row[col] = round(synthetic_value, 1)
                except (ValueError, TypeError):
                    synthetic_row[col] = sample1.get(col) or sample2.get(col)
            
            # Selección aleatoria para columnas categóricas
            for col in categorical_columns:
                hash_col = self._get_data_hash(sample1, seed + i * 1000 + ord(col[0]) if col else 0)
                use_first = (hash_col % 2) == 0
                synthetic_row[col] = sample1.get(col) if use_first else sample2.get(col)
            
            synthetic_samples.append(synthetic_row)
        
        return synthetic_samples
    
    def balance_classes(
        self,
        data: pd.DataFrame,
        target_column: str,
        class_labels: List[str]
    ) -> pd.DataFrame:
        """
        Balancea las clases del dataset usando SMOTE.
        
        Args:
            data: DataFrame con los datos
            target_column: Nombre de la columna objetivo
            class_labels: Lista de etiquetas de clase
            
        Returns:
            DataFrame balanceado
        """
        # Encontrar la clase mayoritaria
        class_counts = data[target_column].value_counts().to_dict()
        max_count = max(class_counts.values(), default=0)
        majority_class = max(class_counts.items(), key=lambda x: x[1])[0] if class_counts else None
        
        if max_count == 0:
            return data
        
        balanced_samples = []
        
        for label in class_labels:
            class_data = data[data[target_column] == label].copy()
            target_count = max_count
            
            # Convertir a lista de diccionarios
            samples = class_data.to_dict('records')
            
            # Generar muestras sintéticas
            balanced_class_samples = self.generate_synthetic_samples(
                samples,
                target_count,
                seed=ord(label[0]) * 1000 if label else 0
            )
            
            balanced_samples.extend(balanced_class_samples)
        
        # Crear DataFrame balanceado
        balanced_df = pd.DataFrame(balanced_samples)
        
        return balanced_df

