import json

class InterviewerAI:
    def __init__(self, user_cv_text, target_industry, target_stack):
        self.user_cv = user_cv_text
        self.industry = target_industry
        self.stack = target_stack
        self.interview_history = []
        self.score = 0

    def analyze_cv(self):
        """
        Simula el análisis del CV por parte de un reclutador IA.
        """
        print(f"[RECRUITER]: Analizando CV para la posición en {self.industry.upper()}...")
        # Lógica simplificada: si el stack está en el CV, sumamos puntos iniciales
        if self.stack.lower() in self.user_cv.lower():
            self.score += 20
            return True, "Tu perfil parece sólido para este stack. Pasemos a la entrevista técnica."
        else:
            return False, "No veo experiencia clara en el stack solicitado, pero te daré una oportunidad en la técnica."

    def generate_interview_question(self):
        """
        Genera preguntas basadas en el stack y el CV.
        """
        # En producción, esto llamaría a Gemini/GPT
        questions = {
            "java": "¿Cómo manejarías una transacción distribuida en un sistema bancario?",
            "python": "¿Cuál es la diferencia entre un decorador y un context manager y cuándo usarías cada uno?",
            "react": "¿Cómo optimizarías un componente que hace re-renders innecesarios por un context muy grande?"
        }
        return questions.get(self.stack.lower(), "¿Cuáles son los principios SOLID y cómo los aplicas?")

    def evaluate_answer(self, answer):
        """
        Evalúa la respuesta del usuario (Simulado).
        """
        # Aquí la IA real analizaría la profundidad técnica
        if len(answer) > 50: # Simulación de una respuesta elaborada
            self.score += 30
            return "Buena respuesta, se nota que conoces los conceptos."
        else:
            self.score += 5
            return "Un poco floja la respuesta. Necesito más profundidad técnica."

    def final_verdict(self):
        if self.score >= 50:
            return "CONTRATADO", "¡Bienvenido a bordo! Pasaste la entrevista. Prepárate para tu primer ticket."
        else:
            return "RECHAZADO", "Lo siento, buscamos un perfil con más seniority técnico. Estudia y vuelve a intentarlo."

# Ejemplo de flujo
if __name__ == "__main__":
    cv = "Desarrollador con 2 años de experiencia en Python y Django."
    interviewer = InterviewerAI(cv, "banking", "python")
    
    # 1. Filtro CV
    passed_cv, msg = interviewer.analyze_cv()
    print(f"Recruiter: {msg}")

    # 2. Pregunta Técnica
    q = interviewer.generate_interview_question()
    print(f"\nTech Lead: {q}")
    
    # 3. Respuesta del usuario
    ans = "Uso decoradores para lógica reutilizable como logging y context managers para asegurar que los recursos como DB se cierren."
    feedback = interviewer.evaluate_answer(ans)
    print(f"Feedback: {feedback}")

    # 4. Veredicto
    status, final_msg = interviewer.final_verdict()
    print(f"\nRESULTADO: {status} - {final_msg}")
