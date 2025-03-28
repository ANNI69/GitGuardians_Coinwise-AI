from flask import Blueprint, request, jsonify, session
from services.chat_service import ChatService

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/message', methods=['POST'])
def handle_message():
    try:
        user_message = request.json.get('message')
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Get conversation history from session
        history = session.get('chat_history', [])
        
        # Process through service
        service = ChatService()
        response, updated_history = service.process_message(user_message, history)
        
        # Update session with new history
        session['chat_history'] = updated_history
        
        return jsonify({
            "success": True,
            "response": response,
            "history": updated_history
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/new-session', methods=['POST'])
def new_session():
    session.pop('chat_history', None)
    return jsonify({"success": True, "message": "New session started"})