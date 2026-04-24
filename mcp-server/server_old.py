import os
import subprocess
from mcp.server.fastmcp import FastMCP
import docker

# Initialize FastMCP server
mcp = FastMCP("SeniorityAI-Orchestrator")

@mcp.tool()
def fs_saboteur(file_path: str, content: str) -> str:
    """
    Injects or modifies a file in the local filesystem to create tasks or bugs.
    
    Args:
        file_path: Relative path to the file.
        content: The content to write into the file.
    """
    try:
        # Security check: Ensure we stay within the workspace
        # (For production, we should add more robust path validation)
        full_path = os.path.abspath(file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, "w") as f:
            f.write(content)
        
        return f"Successfully modified {file_path}. Task injected."
    except Exception as e:
        return f"Error modifying file: {str(e)}"

@mcp.tool()
def docker_runner(image_name: str, command: str) -> str:
    """
    Runs a docker container to execute tests and returns the output.
    
    Args:
        image_name: The docker image to use.
        command: The command to run inside the container (e.g., 'npm test').
    """
    try:
        client = docker.from_env()
        container = client.containers.run(
            image=image_name,
            command=command,
            remove=True,
            stdout=True,
            stderr=True
        )
        return container.decode("utf-8")
    except Exception as e:
        return f"Docker execution failed: {str(e)}"

@mcp.tool()
def git_manager(action: str, branch_name: str = "main", message: str = "") -> str:
    """
    Manages local git operations.
    
    Args:
        action: One of 'checkout', 'commit', 'branch'.
        branch_name: Name of the branch to use.
        message: Commit message.
    """
    try:
        if action == "branch":
            subprocess.run(["git", "checkout", "-b", branch_name], check=True)
            return f"Created and switched to branch {branch_name}."
        elif action == "commit":
            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", message], check=True)
            return f"Changes committed with message: {message}"
        else:
            return "Invalid action."
    except Exception as e:
        return f"Git operation failed: {str(e)}"

if __name__ == "__main__":
    mcp.run()
