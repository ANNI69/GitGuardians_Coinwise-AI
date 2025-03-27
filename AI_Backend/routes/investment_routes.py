from flask import Blueprint, request, jsonify
from services.investment_advisor import InvestmentAdvisor

investment_bp = Blueprint('investment', __name__)

@investment_bp.route('/get-recommendations', methods=['POST'])
def get_recommendations():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({
                "success": False,
                "error": "No input data provided"
            }), 400

        advisor = InvestmentAdvisor()
        result = advisor.get_recommendations(user_data)

        if "error" in result:
            return jsonify({
                "success": False,
                "error": result["error"]
            }), 500

        return jsonify({
            "success": True,
            "recommendations": result.get("recommendations", [])
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500