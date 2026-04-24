# SENIORITY.AI Technical Architecture: The Orchestrator

## 1. The Integration Stack
To maintain a zero-cost model while providing total control, the system uses a hybrid integration approach:

### A. Internal Simulation APIs (The Virtual Workspace)
Instead of using external paid services, we simulate the enterprise environment internally:
- **Jira AI Engine:** A custom API that manages ticket lifecycles, functional/technical analysis, and estimations.
- **Slack AI Engine:** A real-time chat simulation supporting multiple personas (Boss, QA, Junior).
- **Dashboard API:** Tracks real-time telemetry from Git and local execution.

### B. GitHub Integration (The Source of Truth)
- **GitHub API:** Used for repository management, Pull Request creation, and automated line-by-line Code Reviews.
- **Webhooks:** Listens for `push` events to trigger the evaluation pipeline.

### C. MCP (Model Context Protocol) - The "Hands"
We implement an **MCP Server** that runs locally on the user's machine, granting the AI "Cerebro" the following tools:
- `fs_saboteur`: Injects predefined bugs or features into the local filesystem.
- `docker_runner`: Executes the project's test suite inside a container and pipes logs back to the AI.
- `git_manager`: Handles branching, commits, and diff analysis.
- `env_auditor`: Checks if the user's local environment meets the project's standards.

## 2. Integration Workflow
1. **Initiation:** User starts a session. The **Cerebro** uses MCP to clone the target repo and inject the first task.
2. **Tasking:** The **Cerebro** populates the Internal Jira with the new ticket and sends a notification through the Internal Slack.
3. **Execution:** User codes locally. The AI can use MCP to "peek" at the progress if the user stays idle for too long.
4. **Validation:** On `git push`, the AI receives a webhook, triggers `docker_runner` via MCP, and analyzes the test results.
5. **Feedback:** The AI performs a Code Review on the PR and either merges the code or rejects the ticket via Jira/Slack.

## 3. Multiplayer & Squad Mode (Free Team Sync)
To support teams of 2-3 developers at zero infrastructure cost, we use **GitHub as the Shared State**:
- **GitHub Issues:** Acts as the shared Jira board. The AI Orchestrator posts tasks here, and team members can assign them to each other.
- **Pull Request Reviews:** Team members must perform peer-reviews. The **AI Boss** will only step in after at least one human "Approval" or if the team is stuck.
- **Shared Repository:** The industry project is forked into a shared org or user account, allowing all members to see the same codebase and history.

## 4. Requirement Discovery (The Client AI)
Before a task is officially moved to "In Progress," the team (or the Analyst) must interact with the **Client AI** via the Slack-Simulator.
- **Analyst Role:** Extracts requirements and documents them in the GitHub Issue.
- **Developer Role:** Translates the Analyst's findings into code.
- **Validation:** The AI Boss compares the final PR against the Client's initial vague request and the Analyst's documented plan.

