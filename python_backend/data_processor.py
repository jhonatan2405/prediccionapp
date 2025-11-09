"""
Módulo para procesamiento de datos: lectura de CSV/Excel y normalización.
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
import os


class DataProcessor:
    """Clase para procesar datos de archivos CSV y Excel."""
    
    def __init__(self):
        """Inicializa el procesador de datos."""
        self.class_labels = ["Dengue", "Malaria", "Leptospirosis"]
    
    def normalize_diagnosis(self, value: any) -> str:
        """
        Normaliza el valor de diagnóstico a un formato estándar.
        
        Args:
            value: Valor del diagnóstico
            
        Returns:
            Diagnóstico normalizado
        """
        if pd.isna(value):
            return ""
        
        str_value = str(value).strip()
        
        # Mapeo numérico
        numeric_map = {
            "0": "Dengue",
            "1": "Dengue",
            "2": "Malaria",
            "3": "Leptospirosis"
        }
        
        if str_value in numeric_map:
            return numeric_map[str_value]
        
        # Mapeo por palabras clave
        lower_value = str_value.lower()
        if "dengue" in lower_value:
            return "Dengue"
        if "malaria" in lower_value:
            return "Malaria"
        if "leptospir" in lower_value:
            return "Leptospirosis"
        
        return str_value
    
    def find_diagnosis_column(self, df: pd.DataFrame) -> Optional[str]:
        """
        Encuentra la columna de diagnóstico en el DataFrame.
        
        Args:
            df: DataFrame a analizar
            
        Returns:
            Nombre de la columna de diagnóstico o None
        """
        valid_names = [
            "diagnostico", "diagnóstico", "diagnosis", 
            "clase", "class", "label", "target"
        ]
        
        for col in df.columns:
            if col.lower() in valid_names:
                return col
        
        return None
    
    def load_data(self, file_path: str) -> pd.DataFrame:
        """
        Carga datos de un archivo CSV o Excel.
        
        Args:
            file_path: Ruta del archivo
            
        Returns:
            DataFrame con los datos cargados
            
        Raises:
            ValueError: Si el archivo no es válido o no se puede leer
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"El archivo {file_path} no existe")
        
        file_ext = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_ext == '.csv':
                df = pd.read_csv(file_path)
            elif file_ext in ['.xlsx', '.xls']:
                df = pd.read_excel(file_path)
            else:
                raise ValueError(f"Formato de archivo no soportado: {file_ext}")
            
            if df.empty:
                raise ValueError("El archivo está vacío")
            
            return df
        
        except Exception as e:
            raise ValueError(f"Error al leer el archivo: {str(e)}")
    
    def process_data(
        self, 
        file_path: str,
        diagnosis_column: Optional[str] = None
    ) -> Tuple[pd.DataFrame, str, Dict[str, int]]:
        """
        Procesa datos de un archivo y normaliza el diagnóstico.
        
        Args:
            file_path: Ruta del archivo
            diagnosis_column: Nombre de la columna de diagnóstico (opcional)
            
        Returns:
            Tupla con (DataFrame procesado, nombre de columna de diagnóstico, conteos de clase)
        """
        # Cargar datos
        df = self.load_data(file_path)
        
        # Encontrar columna de diagnóstico
        if diagnosis_column is None:
            diagnosis_column = self.find_diagnosis_column(df)
        
        if diagnosis_column is None:
            raise ValueError(
                f"Columna de diagnóstico no encontrada. "
                f"Columnas disponibles: {', '.join(df.columns)}"
            )
        
        if diagnosis_column not in df.columns:
            raise ValueError(f"La columna '{diagnosis_column}' no existe en el archivo")
        
        # Normalizar diagnósticos
        df[diagnosis_column] = df[diagnosis_column].apply(self.normalize_diagnosis)
        
        # Filtrar solo diagnósticos válidos
        df = df[df[diagnosis_column].isin(self.class_labels)]
        
        # Contar clases
        class_counts = df[diagnosis_column].value_counts().to_dict()
        
        return df, diagnosis_column, class_counts
    
    def get_class_distribution(self, df: pd.DataFrame, diagnosis_column: str) -> Dict[str, int]:
        """
        Obtiene la distribución de clases.
        
        Args:
            df: DataFrame con los datos
            diagnosis_column: Nombre de la columna de diagnóstico
            
        Returns:
            Diccionario con conteos por clase
        """
        return df[diagnosis_column].value_counts().to_dict()
    
    def validate_data(self, df: pd.DataFrame, required_columns: List[str]) -> bool:
        """
        Valida que el DataFrame tenga las columnas requeridas.
        
        Args:
            df: DataFrame a validar
            required_columns: Lista de columnas requeridas
            
        Returns:
            True si todas las columnas están presentes
        """
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Columnas faltantes: {', '.join(missing_columns)}")
        return True

