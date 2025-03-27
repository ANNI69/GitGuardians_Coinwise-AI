# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
import re
from routes.tax_routes import tax_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Groq
groq_api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(temperature=1, model_name="llama-3.3-70b-versatile", groq_api_key=groq_api_key)
app.register_blueprint(tax_bp, url_prefix='/api/tax')

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
    app.run(host='0.0.0.0', port=5000, debug=True)