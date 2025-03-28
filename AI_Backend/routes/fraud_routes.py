# routes/fraud_routes.py
from flask import Blueprint, request, jsonify
from services.fraud_detector import AdvancedFraudDetector

fraud_bp = Blueprint('fraud', __name__)

@fraud_bp.route('/analyze', methods=['POST'])
def analyze_transaction():
    try:
        data = request.json
        detector = AdvancedFraudDetector(data['user_id'])
        
        # Validate input format
        if not data.get('transaction'):
            return jsonify({"error": "Missing transaction data", "success": False}), 400
            
        # Get results - don't call .dict() on the results
        real_time_result = detector.analyze_transaction(data['transaction'])
        behavior_result = detector.detect_behavior_anomalies()
        
        return jsonify({
            "success": True,
            "real_time_analysis": real_time_result,
            "behavior_analysis": behavior_result
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Processing error: {str(e)}",
            "success": False
        }), 500