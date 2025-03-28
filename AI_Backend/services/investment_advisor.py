from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import json
import logging
import os

class InvestmentAdvisor:
    def __init__(self):
        self.llm = ChatGroq(temperature=0.3, model_name="llama-3.3-70b-versatile")
        # Get the directory where this file is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Go up one level to the AI_Backend directory
        backend_dir = os.path.dirname(current_dir)
        # Construct path to data file
        data_file = os.path.join(backend_dir, 'data', 'investment_schemes.json')
        
        try:
            with open(data_file) as f:
                self.schemes = json.load(f)
        except FileNotFoundError:
            logging.error(f"Could not find investment schemes file at: {data_file}")
            self.schemes = []
            
        # Configure logging
        logging.basicConfig(level=logging.INFO)

    def get_recommendations(self, user_profile):
        try:
            # Improved prompt with JSON example
            prompt = PromptTemplate.from_template("""
            Analyze user profile and recommend investments. 
            USER PROFILE: {profile}
            SCHEMES: {schemes}

            Return ONLY valid JSON without markdown. Example:
            {{
                "recommendations": [
                    {{
                        "scheme": "Scheme Name",
                        "match_score": "9/10",
                        "reasons": ["Reason 1", "Reason 2"],
                        "suggested_allocation": 60
                    }}
                ]
            }}
            """)

            chain = prompt | self.llm
            response = chain.invoke({
                "profile": json.dumps(user_profile, indent=2),
                "schemes": json.dumps(self.schemes, indent=2)
            })

            # Log raw response for debugging
            logging.info(f"Raw LLM Response: {response.content}")

            # Handle empty response
            if not response.content.strip():
                raise ValueError("Empty response from LLM")

            # Extract JSON from response
            json_str = response.content.split('```json')[1].split('```')[0] if '```json' in response.content else response.content
            json_str = json_str.replace("'", '"').strip()
            
            return json.loads(json_str)

        except json.JSONDecodeError as e:
            logging.error(f"JSON Parse Error: {str(e)}")
            return {"error": f"Invalid JSON format: {str(e)}"}
        except Exception as e:
            logging.error(f"Recommendation Error: {str(e)}")
            return {"error": str(e)}