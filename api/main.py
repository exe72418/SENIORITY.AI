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

@app.post("/pull-request/evaluate")
def evaluate_pr(ticket_id: str):
    """Dispara la evaluación de la IA sobre el código actual."""
    # 1. Llamar al MCP para obtener el git diff
    # 2. Llamar al MCP para correr los tests de Docker
    # 3. Pasar todo al PREvaluator
    return {
        "status": "PROCESSING",
        "message": "The Boss is reviewing your code... Check Slack for feedback."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
