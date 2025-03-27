from flask import Blueprint, request, jsonify
from models.user import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    try:
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        return jsonify(user.to_dict()), 201
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400

@user_bp.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    # In a real app, you'd fetch from database
    # This is a placeholder implementation
    try:
        user = User.get_by_id(user_id)  # Placeholder method
        return jsonify(user.to_dict())
    except Exception:
        return jsonify({'error': 'User not found'}), 404

@user_bp.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    try:
        user = User.get_by_id(user_id)  # Placeholder method
        
        if 'risk_profile' in data:
            user.update_risk_profile(data['risk_profile'])
        
        if 'subscription_tier' in data:
            user.update_subscription(data['subscription_tier'])
            
        if 'two_factor_enabled' in data:
            user.toggle_two_factor()
            
        if 'notification_preferences' in data:
            for channel, enabled in data['notification_preferences'].items():
                user.update_notification_preferences(channel, enabled)
                
        return jsonify(user.to_dict())
    except Exception:
        return jsonify({'error': 'User not found'}), 404

@user_bp.route('/user/<user_id>/balance', methods=['POST'])
def update_balance(user_id):
    data = request.get_json()
    try:
        user = User.get_by_id(user_id)  # Placeholder method
        amount = float(data['amount'])
        user.update_balance(amount)
        return jsonify({'new_balance': user.account_balance})
    except Exception:
        return jsonify({'error': 'Invalid request'}), 400

@user_bp.route('/user/<user_id>/bank-account', methods=['POST'])
def add_bank_account(user_id):
    data = request.get_json()
    try:
        user = User.get_by_id(user_id)  # Placeholder method
        user.add_bank_account(data['bank_account'])
        return jsonify({'message': 'Bank account added successfully'})
    except Exception:
        return jsonify({'error': 'Invalid request'}), 400
