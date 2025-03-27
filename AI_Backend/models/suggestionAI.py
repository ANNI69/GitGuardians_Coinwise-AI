from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Define the template for the prompt
template = """
<|system|>
You are a certified financial advisor specializing in personal finance and saving habits.
Provide concrete, numbered advice with specific examples. Keep responses under 150 words.
</s>
<|user|>
{question}
</s>
<|assistant|>"""

# Create the prompt template
prompt = PromptTemplate(
    template=template,
    input_variables=["question"]
)

# Initialize the Groq model
model = ChatGroq(
    temperature=0.3,
    model_name="llama2-70b-4096",
    api_key=os.getenv("GROQ_API_KEY")
)

# Create the chain using the new syntax
chain = prompt | model

class QuestionRequest(BaseModel):
    question: str

def ask_suggestion(request: QuestionRequest):
    try:
        # Get response from the chain
        response = chain.invoke({"question": request.question})
        
        # Clean up the response
        cleaned_response = response.content.strip().replace("</s>", "")
        
        return {"answer": cleaned_response}
        
    except Exception as e:
        raise Exception(f"Failed to process question: {str(e)}")
