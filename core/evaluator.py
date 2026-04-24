import json
from .ai_adapter import AIAdapter

class PREvaluator:
    def __init__(self, ai_adapter: AIAdapter):
        self.ai_adapter = ai_adapter

    def evaluate(self, task_data, code_diff, test_results):
        """
        Analiza el trabajo del usuario y devuelve una evaluación técnica.
        
        task_data: Diccionario con la info del ticket de Jira.
        code_diff: El string con los cambios de git (git diff).
        test_results: Logs de salida de Docker / Tests.
        """
        
        evaluation_prompt = f"""
        ACTÚA COMO: Un Tech Lead Senior (The Boss) evaluando un Pull Request.
        
        CONTEXTO DE LA TAREA:
        - Título: {task_data['title']}
        - Requisitos Técnicos: {task_data['technical_analysis']}
        
        CÓDIGO ENTREGADO (DIFF):
        {code_diff}
        
        RESULTADO DE TESTS (DOCKER):
        {test_results}
        
        TU MISIÓN:
        Analiza el código y los tests. Debes ser extremadamente exigente. 
        Busca:
        1. ¿El código soluciona el problema descrito?
        2. ¿La calidad es de nivel Senior? (Naming, limpieza, performance).
        3. ¿Pasaron todos los tests?
        4. ¿Hay bugs nuevos o vulnerabilidades de seguridad?
        
        RESPONDE ÚNICAMENTE EN FORMATO JSON:
        {{
            "status": "APPROVED" | "REJECTED",
            "score": 0-100,
            "technical_debt_score": 0-100,
            "review_comments": [
                "Comentario 1 (en Spanglish)",
                "Comentario 2"
            ],
            "security_alerts": ["Alerta 1", "Alerta 2"]
        }}
        """

        # En la realidad, enviaríamos esto a la IA
        # Por ahora, simulamos la respuesta de la IA
        print("[EVALUATOR] Analyzing PR...")
        
        # Simulación de lógica de evaluación
        if "ERROR" in test_results.upper() or "FAIL" in test_results.upper():
            return {
                "status": "REJECTED",
                "score": 20,
                "technical_debt_score": 50,
                "review_comments": ["Che, el build está roto. Arreglá los tests antes de pedir review.", "Nivel muy bajo de atención al detalle."],
                "security_alerts": []
            }
        
        return {
            "status": "APPROVED",
            "score": 85,
            "technical_debt_score": 10,
            "review_comments": ["Buen fix. El N+1 se solucionó correctamente.", "El naming de 'temp_var' podría mejorar, pero el algoritmo es sólido."],
            "security_alerts": []
        }

# Ejemplo de flujo
if __name__ == "__main__":
    from .ai_adapter import AIAdapter
    adapter = AIAdapter("gemini", "FAKE_KEY")
    evaluator = PREvaluator(adapter)
    
    task = {"title": "Fix Bank Bug", "technical_analysis": "Validate amount > 0"}
    diff = "+ if (amount > 0) { process(); }"
    logs = "Tests passed: 12/12"
    
    result = evaluator.evaluate(task, diff, logs)
    print(json.dumps(result, indent=2))
