# routes/tax_routes.py
from flask import Blueprint, request, jsonify, send_file
from services.tax_processor import TaxProcessor
from io import BytesIO
from reportlab.pdfgen import canvas

tax_bp = Blueprint('tax', __name__)

@tax_bp.route('/calculate-tax', methods=['POST'])
def calculate_tax():
    financial_data = request.json
    tax_processor = TaxProcessor()
    tax_liability = tax_processor.calculate_tax(financial_data)
    return jsonify(tax_liability)

@tax_bp.route('/generate-itr', methods=['POST'])
def generate_itr():
    tax_data = request.json
    tax_processor = TaxProcessor()
    
    # Get filled form structure
    itr_form = tax_processor.generate_itr_form(tax_data)
    
    # Generate PDF
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    
    # Add form data to PDF
    p.drawString(100, 800, f"Taxable Income: {itr_form['income_details']['taxable_income']}")
    p.drawString(100, 780, f"Tax Payable: {itr_form['tax_payable']}")
    
    p.save()
    
    buffer.seek(0)
    return send_file(
        buffer,
        as_attachment=True,
        download_name="ITR_FORM.pdf",
        mimetype='application/pdf'
    )