from flask import Blueprint, request, jsonify
from models.suggestionAI import ask_suggestion, QuestionRequest

suggestion_bp = Blueprint('suggestion', __name__)

@suggestion_bp.route('/suggestion/ask', methods=['POST'])
def get_suggestion():
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({"error": "Question is required"}), 400
            
        request_data = QuestionRequest(question=data["question"])
        response = ask_suggestion(request_data)
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
