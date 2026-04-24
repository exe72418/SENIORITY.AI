import os
import json
from abc import ABC, abstractmethod

class AIService(ABC):
    @abstractmethod
    def generate_response(self, system_prompt: str, messages: list) -> str:
        pass

class GeminiService(AIService):
    def __init__(self, api_key: str):
        self.api_key = api_key
        # En producción se inicializaría el cliente real: import google.generativeai as genai

    def generate_response(self, system_prompt: str, messages: list) -> str:
        # Mock de llamada a Gemini
        print(f"[AI-ADAPTER] Calling Gemini with {len(messages)} messages...")
        return "Respuesta simulada de Gemini basada en el prompt del sistema."

class OpenAIService(AIService):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def generate_response(self, system_prompt: str, messages: list) -> str:
        # Mock de llamada a GPT-4
        print(f"[AI-ADAPTER] Calling OpenAI...")
        return "Respuesta simulada de GPT-4."

class AIAdapter:
    def __init__(self, provider: str, api_key: str):
        if provider == "gemini":
            self.service = GeminiService(api_key)
        elif provider == "openai":
            self.service = OpenAIService(api_key)
        else:
            raise ValueError(f"Provider {provider} not supported.")

    def chat(self, personality_file: str, conversation_history: list) -> str:
        """
        Envía la historia de la conversación al proveedor seleccionado
        usando el archivo de personalidad (prompt) correspondiente.
        """
        # 1. Leer el system prompt
        base_path = os.path.dirname(__file__)
        prompt_path = os.path.join(base_path, "prompts", personality_file)
        
        with open(prompt_path, "r") as f:
            system_prompt = f.read()

        # 2. Obtener respuesta del servicio
        return self.service.generate_response(system_prompt, conversation_history)

# Ejemplo de uso
if __name__ == "__main__":
    adapter = AIAdapter("gemini", "FAKE_KEY")
    history = [{"role": "user", "content": "Hola, ¿cuál es mi tarea?"}]
    response = adapter.chat("boss_system.txt", history)
    print(f"Boss: {response}")
