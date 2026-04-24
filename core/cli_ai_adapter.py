import os
import requests

class LocalCLIAI:
    def __init__(self, command_template='gemini prompt "{prompt}"'):
        self.command_template = command_template
        self.api_key = os.getenv("AI_API_KEY")
        self.bridge_url = "http://host.docker.internal:8002/execute"

    def ask(self, system_prompt, user_message):
        """
        Intenta usar el Host Bridge (CLI local), si falla o está apagado, 
        cae automáticamente al modo API directa (si hay una KEY).
        """
        full_prompt = f"{system_prompt}\n\nUsuario dice: {user_message}\n\nResponde como el personaje indicado:"
        
        # 1. Intentar vía Host Bridge (CLI Local)
        try:
            print(f"[AI-ADAPTER] Intentando conectar con Host Bridge en 8002...")
            payload = {"command_template": self.command_template, "prompt": full_prompt}
            response = requests.post(self.bridge_url, json=payload, timeout=2) # Timeout corto para no trabar
            
            if response.status_code == 200:
                data = response.json()
                if data.get("exit_code") == 0:
                    return data.get("stdout")
        except Exception:
            print("[AI-ADAPTER] Host Bridge no detectado. Intentando fallback a API directa...")

        # 2. Fallback a API Directa (Si hay Key en el .env)
        if self.api_key:
            return self._call_gemini_api(system_prompt, user_message)
        
        return "Error: No se pudo conectar con tu CLI local (puerto 8002) y no tenés una AI_API_KEY configurada en el .env."

    def _call_gemini_api(self, system_prompt, user_message):
        print("[AI-ADAPTER] Usando API directa de Gemini (Fallback)...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [{
                "parts": [{"text": f"{system_prompt}\n\nUsuario: {user_message}"}]
            }]
        }
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            data = response.json()
            if 'candidates' in data:
                return data['candidates'][0]['content']['parts'][0]['text']
            return f"Error en respuesta de API: {str(data)}"
        except Exception as e:
            return f"Error llamando a la API de Gemini: {str(e)}"
