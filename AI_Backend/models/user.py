from datetime import datetime

class User:
    def __init__(self, user_id, email, password_hash, first_name, last_name, created_at=None):
        self.user_id = user_id
        self.email = email 
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.created_at = created_at or datetime.utcnow()
        self.account_balance = 0.0
        self.transactions = []
        self.investment_portfolio = {}
        self.risk_profile = None
        self.kyc_verified = False
        self.two_factor_enabled = False
        self.notification_preferences = {
            'email': True,
            'push': False,
            'sms': False
        }
        self.linked_bank_accounts = []
        self.subscription_tier = 'basic'

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat(),
            'account_balance': self.account_balance,
            'kyc_verified': self.kyc_verified,
            'two_factor_enabled': self.two_factor_enabled,
            'subscription_tier': self.subscription_tier,
            'risk_profile': self.risk_profile
        }

    def update_balance(self, amount):
        self.account_balance += amount

    def add_transaction(self, transaction):
        self.transactions.append(transaction)

    def update_risk_profile(self, profile):
        self.risk_profile = profile

    def add_bank_account(self, bank_account):
        self.linked_bank_accounts.append(bank_account)

    def update_subscription(self, tier):
        self.subscription_tier = tier

    def toggle_two_factor(self):
        self.two_factor_enabled = not self.two_factor_enabled

    def update_notification_preferences(self, channel, enabled):
        if channel in self.notification_preferences:
            self.notification_preferences[channel] = enabled
