import subprocess
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/execute', methods=['POST'])
def execute_cli():
    """
    Recibe un prompt, lo ejecuta en el CLI local y devuelve el resultado.
    """
    data = request.json
    command_template = data.get("command_template", 'gemini prompt "{prompt}"')
    prompt = data.get("prompt", "")
    
    # Escapamos el prompt para la terminal
    escaped_prompt = prompt.replace('"', '\\"')
    cmd = command_template.replace("{prompt}", escaped_prompt)
    
    print(f"[HOST-BRIDGE] Ejecutando localmente: {cmd[:50]}...")
    
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=60
        )
        return jsonify({
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
            "exit_code": result.returncode
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Corremos en el puerto 8002 de tu PC real
    print("🚀 Seniority Host Bridge activo en el puerto 8002...")
    print("Esperando pedidos de Docker para usar tu CLI local...")
    app.run(host='0.0.0.0', port=8002)
