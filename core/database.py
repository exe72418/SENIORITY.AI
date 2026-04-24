import sqlite3
import os

class SeniorityDB:
    def __init__(self, db_path="seniority_ai.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Inicializa las tablas si no existen."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # 1. Perfil del Usuario
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_profile (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT,
                    seniority_score INTEGER DEFAULT 0,
                    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            # 2. Estado de la Carrera
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS career_state (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    industry TEXT,
                    role TEXT,
                    is_hired BOOLEAN DEFAULT 0,
                    current_seniority TEXT
                )
            ''')

            # 3. Historial de Tareas (Jira)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS task_history (
                    id TEXT PRIMARY KEY,
                    title TEXT,
                    industry TEXT,
                    status TEXT, -- DONE, REJECTED, IN_PROGRESS
                    estimation_accuracy FLOAT,
                    technical_debt_score INTEGER,
                    completed_at DATETIME
                )
            ''')

            # 4. Memoria del Chat (Slack)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS chat_memory (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    persona TEXT, -- BOSS, QA, JUNIOR
                    role TEXT, -- user, assistant
                    content TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()

    def save_message(self, persona, role, content):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO chat_memory (persona, role, content) VALUES (?, ?, ?)',
                           (persona, role, content))
            conn.commit()

    def get_chat_history(self, persona, limit=10):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT role, content FROM chat_memory WHERE persona = ? ORDER BY timestamp DESC LIMIT ?',
                           (persona, limit))
            return cursor.fetchall()[::-1] # Invertir para que sea cronológico

# Ejemplo de uso
if __name__ == "__main__":
    db = SeniorityDB()
    db.save_message("BOSS", "assistant", "Che, muy buen push el de hoy.")
    print("Historial:", db.get_chat_history("BOSS"))
