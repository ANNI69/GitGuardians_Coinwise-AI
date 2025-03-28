# models/behaviour_analysis.py
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from datetime import datetime
import json
import logging
from typing import List, Dict

class BehaviorAnalyzer:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.scaler = StandardScaler()
        self.model = IsolationForest(n_estimators=100, contamination=0.05)
        self.transaction_history = self._load_transaction_data()
        
    def _load_transaction_data(self) -> List[Dict]:
        """Fetch last 6 months transactions from Firestore"""
        # Example mock data - Replace with Firestore query
        return [
            {"amount": 1500, "category": "Food", "timestamp": "2024-05-01 12:00:00"},
            {"amount": 50000, "category": "Electronics", "timestamp": "2024-05-02 14:30:00"},
            {"amount": 2500, "category": "Entertainment", "timestamp": "2024-05-03 19:45:00"},
            {"amount": 3000, "category": "Utilities", "timestamp": "2024-05-05 10:15:00"},
            {"amount": 15000, "category": "Education", "timestamp": "2024-05-07 09:30:00"},
            {"amount": 8000, "category": "Healthcare", "timestamp": "2024-05-10 11:20:00"}
        ]
    def _extract_features(self) -> pd.DataFrame:
        """Convert raw transactions to ML features"""
        df = pd.DataFrame(self.transaction_history)
        
        # Feature Engineering
        df['hour'] = df['timestamp'].apply(lambda x: datetime.strptime(x, "%Y-%m-%d %H:%M:%S").hour)
        df['amount_norm'] = self.scaler.fit_transform(df[['amount']])
        df['category_risk'] = df['category'].map({
            'Food': 1, 'Utilities': 2, 'Electronics': 5
        }).fillna(3)  # Risk score 1-5
        
        return df[['amount_norm', 'hour', 'category_risk']]
    
    def train_model(self):
        """Train anomaly detection model"""
        try:
            if len(self.transaction_history) < 50:
                raise ValueError("Insufficient data for training")
                
            features = self._extract_features()
            self.model.fit(features)
            
        except Exception as e:
            logging.error(f"Training failed: {str(e)}")
            self.model = None  # Fallback to rules

    def detect_anomalies(self) -> List[Dict]:
        """Identify unusual patterns"""
        if not self.model:
            return self._rule_based_fallback()
            
        features = self._extract_features()
        predictions = self.model.predict(features)
        
        anomalies = []
        for i, pred in enumerate(predictions):
            if pred == -1:  # Anomaly flag
                anomaly = {
                    "transaction": self.transaction_history[i],
                    "reason": self._explain_anomaly(features.iloc[i]),
                    "confidence": 0.85  # Example value
                }
                anomalies.append(anomaly)
                
        return anomalies
    
    def _explain_anomaly(self, features: pd.Series) -> str:
        """Generate human-readable explanations"""
        explanations = []
        
        if features['amount_norm'] > 3:
            explanations.append(f"High amount (Z-score: {features['amount_norm']:.2f})")
            
        if features['hour'] not in [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]:
            explanations.append(f"Unusual hour: {int(features['hour'])}:00")
            
        if features['category_risk'] >= 4:
            explanations.append("High-risk category")
            
        return ", ".join(explanations) or "Complex pattern deviation"

    def _rule_based_fallback(self) -> List[Dict]:
        """Fallback when ML model unavailable"""
        avg = np.mean([t['amount'] for t in self.transaction_history])
        return [
            t for t in self.transaction_history 
            if t['amount'] > 3 * avg
        ]