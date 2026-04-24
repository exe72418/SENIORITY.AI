from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.database import SeniorityDB
from core.interviewer import InterviewerAI
from core.engine import SeniorityEngine
import os

app = FastAPI(title="Seniority.AI Orchestrator API")

# Configuración de CORS para que la Web UI pueda hablar con la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción restringir a localhost:3000
    allow_methods=["*"],
    allow_headers=["*"],
)

db = SeniorityDB()

# Modelos de datos
class Application(BaseModel):
    industry: str
    role: str
    seniority: str
    cv_text: str

class InterviewAnswer(BaseModel):
    answer: str

# --- Endpoints ---

@app.get("/health")
def health_check():
    return {"status": "online", "mcp_agent": "connected"}

@app.post("/apply")
def apply_for_job(app_data: Application):
    """Inicia el proceso de selección."""
    try:
        interviewer = InterviewerAI(app_data.cv_text, app_data.industry, app_data.role)
        passed_cv, message = interviewer.analyze_cv()
        
        # Guardar estado en la DB
        # Aquí llamaríamos a un método de db para actualizar career_state
        
        return {
            "passed_cv": passed_cv,
            "message": message,
            "initial_question": interviewer.generate_interview_question()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/workspace/status")
def get_workspace_status():
    """Obtiene el estado actual del ticket y la industria."""
    # En una fase real, esto leería de la DB
    return {
        "current_ticket": "BANK-101",
        "status": "IN_PROGRESS",
        "time_remaining": "02:14:55",
        "logs": [
            "[SYSTEM] Local files modified by fs_saboteur",
            "[JIRA] Ticket BANK-101 created."
        ]
    }

from core.cli_ai_adapter import LocalCLIAI

# ... (código existente) ...

class ChatRequest(BaseModel):
    personality_file: str
    user_message: str
    command_template: str = 'gemini prompt "{prompt}"'

@app.post("/chat/local-cli")
def chat_with_local_ai(req: ChatRequest):
    """Llama a la IA de la terminal del usuario."""
    try:
        # 1. Leer el system prompt
        base_path = os.path.dirname(os.path.dirname(__file__))
        prompt_path = os.path.join(base_path, "core", "prompts", req.personality_file)
        
        with open(prompt_path, "r") as f:
            system_prompt = f.read()

        # 2. Ejecutar comando de terminal
        cli_ai = LocalCLIAI(command_template=req.command_template)
        response = cli_ai.ask(system_prompt, req.user_message)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
