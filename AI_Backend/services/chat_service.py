from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_groq import ChatGroq
import os

class ChatService:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0.5,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=os.getenv("GROQ_API_KEY")
        )
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful AI assistant. Maintain context between messages."),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        # Initialize an empty conversation history if needed
        self.conversation_history = []

    def process_message(self, user_message, history=None):
        # Use provided history or default to empty list
        if history is None:
            history = self.conversation_history
        
        # Create memory from history
        memory = ConversationBufferMemory(return_messages=True)
        for msg in history:
            if msg.startswith("Human:"):
                memory.chat_memory.add_user_message(msg.replace("Human: ", ""))
            elif msg.startswith("AI:"):
                memory.chat_memory.add_ai_message(msg.replace("AI: ", ""))

        # Create conversation chain
        conversation = ConversationChain(
            llm=self.llm,
            memory=memory,
            prompt=self.prompt,
            verbose=False
        )

        # Get response
        response = conversation.predict(input=user_message)
        
        # Update conversation history
        new_history = [
            *history,
            f"Human: {user_message}",
            f"AI: {response}"
        ]
        
        # Store the updated history
        self.conversation_history = new_history
        
        return response, new_history