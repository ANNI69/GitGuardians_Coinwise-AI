# tax_processor.py
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import json

class TaxProcessor:
    def __init__(self):
        self.llm = ChatGroq(temperature=0, model_name="mixtral-8x7b-32768")
        
        self.tax_slabs = {
            "INDIA": {
                "FY2024": [
                    {"min": 0, "max": 300000, "rate": 0},
                    {"min": 300001, "max": 600000, "rate": 5},
                    {"min": 600001, "max": 900000, "rate": 10},
                    {"min": 900001, "max": 1200000, "rate": 15},
                    {"min": 1200001, "max": 1500000, "rate": 20},
                    {"min": 1500001, "rate": 30}
                ]
            }
        }
        
        self.deduction_categories = {
            "80C": ["EPF", "PPF", "ELSS", "Insurance"],
            "80D": ["Health Insurance"],
            "24": ["Home Loan Interest"]
        }

    def calculate_tax(self, financial_data, country="INDIA", fy="FY2024"):
        # AI-powered deduction identification
        deduction_prompt = PromptTemplate.from_template("""
        Identify tax deductions from these transactions:
        {transactions}
        
        Available deduction sections: {sections}
        Return JSON: {{"deductions": [{{"section": "80C", "amount": 150000, "description": "EPF Contribution"}}]}}
        """)
        
        chain = deduction_prompt | self.llm
        deductions = json.loads(chain.invoke({
            "transactions": json.dumps(financial_data['transactions']),
            "sections": json.dumps(self.deduction_categories)
        }).content)

        # Tax calculation logic
        taxable_income = financial_data['total_income'] - sum(
            [d['amount'] for d in deductions['deductions']]
        )
        
        tax = 0
        for slab in self.tax_slabs[country][fy]:
            if taxable_income > slab['min']:
                slab_max = slab.get('max', taxable_income)
                slab_income = min(taxable_income, slab_max) - slab['min']
                tax += slab_income * (slab['rate'] / 100)
                
        return {
            "taxable_income": taxable_income,
            "total_tax": tax,
            "deductions": deductions,
            "slabs_used": self.tax_slabs[country][fy]
        }

    def generate_itr_form(self, tax_data):
        # AI-powered form filling
        form_prompt = PromptTemplate.from_template("""
        Fill ITR form with:
        {tax_data}
        
        Return JSON with form field mappings for ITR-1:
        {{
            "personal_info": {{...}},
            "income_details": {{...}},
            "deductions": {{...}},
            "tax_payable": {tax}
        }}
        """)
        
        chain = form_prompt | self.llm
        return json.loads(chain.invoke({"tax_data": tax_data}).content)