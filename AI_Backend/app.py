from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.investment_routes import investment_bp
from routes.user import user_bp
from routes.fraud_routes import fraud_bp
from PyPDF2 import PdfReader
import re
import json
import os


from routes.chat_routes import chat_bp
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load JSON data on startup
def load_json_data():
    try:
        with open('data.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print("Warning: data.json not found")
        return {}
    except json.JSONDecodeError:
        print("Warning: Invalid JSON in data.json")
        return {}

# Initialize global data
json_data = load_json_data()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "your-default-secret-key-for-development")
# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(investment_bp, url_prefix='/api/investment')
app.register_blueprint(fraud_bp, url_prefix='/api/fraud')
app.register_blueprint(chat_bp, url_prefix='/api/chat')

# Get API key from environment variables
groq_api_key = os.getenv('GROQ_API_KEY')
llm = ChatGroq(temperature=1, model_name="llama-3.3-70b-versatile", groq_api_key=groq_api_key)

# Transaction Extraction Template
extraction_template = """
Analyze the following bank statement text and extract all transactions with:
- Date (YYYY-MM-DD format)
- Description
- Amount (numeric value only)
- Type (income/expense)

Format the output as a JSON array. Example:
[
  {{
    "date": "2024-05-01",
    "description": "Salary Credit",
    "amount": 75000,
    "type": "income"
  }}
]

Statement Text:
{text}
"""

extraction_prompt = PromptTemplate.from_template(extraction_template)

# Categorization Template
categories = [
    "Food", "Transport", "Housing", "Utilities", 
    "Entertainment", "Healthcare", "Education", "Other"
]

categorization_template = """
Categorize this transaction into one of these categories: {categories}

Transaction Details:
- Date: {date}
- Description: {description}
- Amount: {amount}
- Type: {type}

Respond only with the category name. Do not include any other text.
"""

categorization_prompt = PromptTemplate.from_template(categorization_template)

def process_pdf(file):
    try:
        # Extract text from PDF
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        
        # Extract transactions
        extraction_chain = extraction_prompt | llm
        raw_transactions = extraction_chain.invoke({"text": text}).content
        
        # Clean and parse JSON
        json_match = re.search(r'\[.*\]', raw_transactions, re.DOTALL)
        if not json_match:
            raise ValueError("No valid transactions found in response")
        
        transactions = eval(json_match.group(0))
        
        # Categorize transactions
        categorized_transactions = []
        for txn in transactions:
            chain = categorization_prompt | llm
            category = chain.invoke({
                "date": txn["date"],
                "description": txn["description"],
                "amount": txn["amount"],
                "type": txn["type"],
                "categories": ", ".join(categories)
            }).content.strip()
            
            txn["category"] = category
            categorized_transactions.append(txn)
        
        # Calculate financial analysis
        analysis = calculate_analysis(categorized_transactions)
        
        return {
            "transactions": categorized_transactions,
            "analysis": analysis
        }
        
    except Exception as e:
        raise RuntimeError(f"PDF processing failed: {str(e)}")

def calculate_analysis(transactions):
    analysis = {
        "total_income": 0,
        "total_expenses": 0,
        "categories": {},
        "expense_to_income_ratio": 0,
        "category_percentages": {}
    }
    
    for txn in transactions:
        amount = float(txn["amount"])
        if txn["type"] == "income":
            analysis["total_income"] += amount
        else:
            analysis["total_expenses"] += amount
            category = txn["category"]
            analysis["categories"][category] = analysis["categories"].get(category, 0) + amount
            
    if analysis["total_income"] > 0:
        analysis["expense_to_income_ratio"] = round(
            (analysis["total_expenses"] / analysis["total_income"]) * 100, 2
        )
        
        for category, amount in analysis["categories"].items():
            analysis["category_percentages"][category] = round(
                (amount / analysis["total_income"]) * 100, 2
            )
    
    return analysis

@app.route('/api/process-statement', methods=['POST'])
def process_statement():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file name"}), 400
        
    try:
        result = process_pdf(file)
        return jsonify({
            "success": True,
            "transaction_count": len(result["transactions"]),
            "transactions": result["transactions"],
            "financial_analysis": result["analysis"]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)