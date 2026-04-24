import json
import os

class SeniorityEngine:
    def __init__(self, user_profile):
        """
        user_profile: {
            "industry": "banking",
            "role": "backend",
            "seniority": "trainee",
            "mode": "career"
        }
        """
        self.user_profile = user_profile
        self.current_task = None

    def get_task_from_catalog(self):
        # En una fase real, esto leería de industries/{industry}/tasks.json
        # Por ahora, simulamos una tarea de nivel Trainee para un Banco
        tasks = {
            "banking": [
                {
                    "id": "BANK-101",
                    "title": "Bug en validación de montos negativos",
                    "description": "Se detectó que el sistema permite transferencias con montos negativos si se manipula el payload.",
                    "technical_analysis": "El archivo `services/transfer.py` no valida que `amount` sea > 0.",
                    "files_to_sabotage": [
                        {
                            "path": "services/transfer.py",
                            "content": "def process_transfer(from_acc, to_acc, amount):\n    # TODO: Falta validación crítica\n    print(f'Transferring {amount}...')\n    return True"
                        }
                    ],
                    "expected_test": "tests/test_transfer.py"
                }
            ]
        }
        return tasks.get(self.user_profile["industry"], [])[0]

    def start_session(self):
        task = self.get_task_from_catalog()
        self.current_task = task
        
        print(f"--- INICIANDO SESIÓN: {self.user_profile['industry'].upper()} ---")
        
        # 1. Simulación de Sabotaje (esto lo haría el MCP en la realidad)
        for sabotage in task["files_to_sabotage"]:
            print(f"[MCP] Inyectando bug en: {sabotage['path']}")
            # Aquí se llamaría a mcp.call_tool("fs_saboteur", ...)
        
        # 2. Generación de Jira (Simulado)
        jira_ticket = {
            "id": task["id"],
            "status": "TO DO",
            "summary": task["title"],
            "functional_analysis": task["description"],
            "technical_notes": task["technical_analysis"],
            "estimate": "2h"
        }
        
        # 3. Mensaje del Jefe (Spanglish Mode)
        boss_msg = f"Hey, {self.user_profile['role']}! Te asigné {task['id']}. " \
                   f"Es un fix prioritario porque estamos perdiendo consistencia en la DB. " \
                   f"Checkealo ASAP y abrí un PR. No te olvides de los tests, ok?"
        
        return {
            "jira": jira_ticket,
            "slack": boss_msg
        }

# Ejemplo de ejecución
if __name__ == "__main__":
    profile = {"industry": "banking", "role": "backend", "seniority": "trainee"}
    engine = SeniorityEngine(profile)
    output = engine.start_session()
    print("\n[JIRA TICKET]:", json.dumps(output["jira"], indent=2))
    print("\n[SLACK - THE BOSS]:", output["slack"])
