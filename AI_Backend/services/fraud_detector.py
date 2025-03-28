# services/fraud_detector.py
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel
import json
import logging

# Define strict output schema
class FraudAnalysisResult(BaseModel):
    risk_score: int
    is_anomalous: bool
    primary_reason: str
    supporting_evidence: str
    confidence: float

class BehaviorAnalysisResult(BaseModel):
    total_anomalies: int
    anomalies: list
    overall_risk_trend: str

class AdvancedFraudDetector:
    def __init__(self, user_id):
        self.user_id = user_id
        self.llm = ChatGroq(temperature=0, model_name="llama-3.3-70b-versatile")  # More deterministic
        self.parser = JsonOutputParser(pydantic_object=FraudAnalysisResult)
        self.transaction_history = self._load_transaction_history()

    def _load_transaction_history(self):
        """Load real transaction data from Firestore"""
        try:
            # Placeholder implementation - replace with actual Firestore code
            # For now, return an empty list instead of [...]
            return []
            
            # When implementing the real version:
            # db = firestore.client()
            # transactions_ref = db.collection('transactions').where('user_id', '==', self.user_id)
            # transactions = [doc.to_dict() for doc in transactions_ref.stream()]
            # return transactions
        except Exception as e:
            logging.error(f"Failed to load transaction history: {str(e)}")
            return []

    def _get_behavior_profile(self):
        """Generate a behavior profile based on transaction history"""
        try:
            # Extract key behavioral patterns from transaction history
            if not self.transaction_history:
                return {"user_id": self.user_id, "profile_status": "insufficient_data"}
            
            # Calculate basic metrics
            transaction_count = len(self.transaction_history)
            avg_amount = sum(tx.get('amount', 0) for tx in self.transaction_history) / max(transaction_count, 1)
            
            # Get unique merchants/categories
            merchants = set(tx.get('merchant', '') for tx in self.transaction_history)
            categories = set(tx.get('category', '') for tx in self.transaction_history)
            
            return {
                "user_id": self.user_id,
                "transaction_count": transaction_count,
                "average_amount": avg_amount,
                "merchant_diversity": len(merchants),
                "category_diversity": len(categories),
                "profile_status": "active" if transaction_count > 0 else "new_user"
            }
        except Exception as e:
            logging.error(f"Failed to generate behavior profile: {str(e)}")
            return {"user_id": self.user_id, "profile_status": "error", "error": str(e)}

    def analyze_transaction(self, transaction):
        """Analyze a transaction for potential fraud"""
        try:
            # Load user behavior profile
            behavior_profile = self._get_behavior_profile()
            
            # Convert transaction to dict if it's not already a dict
            transaction_data = transaction
            if hasattr(transaction, 'dict') and callable(getattr(transaction, 'dict')):
                transaction_data = transaction.dict()
            elif hasattr(transaction, 'model_dump') and callable(getattr(transaction, 'model_dump')):
                transaction_data = transaction.model_dump()
            
            # Perform analysis
            result = {
                "success": True,
                "is_anomalous": False,
                "risk_score": 0,
                "primary_reason": "",
                "supporting_evidence": "",
                "confidence": 0.0
            }
            
            # Basic analysis logic
            # This is where we would implement actual fraud detection algorithms
            
            return result
            
        except Exception as e:
            logging.error(f"Transaction analysis failed: {str(e)}")
            return {
                "success": False,
                "is_anomalous": False,
                "risk_score": 0,
                "primary_reason": "Analysis failed",
                "supporting_evidence": str(e),
                "confidence": 0.0
            }

    def detect_behavior_anomalies(self):
        """Strict behavior pattern analysis"""
        try:
            prompt = PromptTemplate(
                template="""
                Analyze transaction history. Return JSON ONLY:
                {schema}
                
                Transactions:
                {history}
                """,
                input_variables=["history"],
                partial_variables={"schema": BehaviorAnalysisResult.schema_json()}
            )
            
            chain = prompt | self.llm | JsonOutputParser(pydantic_object=BehaviorAnalysisResult)
            
            return chain.invoke({
                "history": json.dumps(self.transaction_history)
            })
            
        except Exception as e:
            logging.error(f"Behavior analysis failed: {str(e)}")
            return BehaviorAnalysisResult(
                total_anomalies=0,
                anomalies=[],
                overall_risk_trend="Analysis failed"
            )

    def behavior_analysis(self, transaction_data):
        """Analyze user behavior patterns for anomalies"""
        try:
            # Don't call .dict() on transaction_data as it might already be a dict
            # Instead, use it directly
            
            # Placeholder for behavior analysis logic
            return {
                "total_anomalies": 0,
                "anomalies": [],
                "overall_risk_trend": "Analysis failed"
            }
        except Exception as e:
            logging.error(f"Behavior analysis failed: {str(e)}")
            return {
                "total_anomalies": 0,
                "anomalies": [],
                "overall_risk_trend": "Analysis failed"
            }