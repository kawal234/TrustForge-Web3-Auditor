# TrustForge: Autonomous Web3 Smart Contract Auditor & Deployment Agent

An autonomous agent pipeline built on the TrueForge harness to securely audit, test, and deploy Web3 smart contracts.



https://github.com/user-attachments/assets/f73269a5-a744-4fa9-ac12-06e9b3b3f373



## Architecture

TrustForge uses a multi-agent system orchestrating specialized tasks:
1. **Static Analysis**: Sub-agents load `skills/web3-audit/SKILL.md` and `skills/gas-optimizer/SKILL.md` to identify bugs and inefficiencies in `.sol` contracts.
2. **Sandbox Testing**: Leverages the isolated `sandbox-templates/hardhat-env` execution environment in Daytona.
3. **Live Network Context**: FastMCP server connects to Web3 RPCs and Etherscan to verify live base fees and contract verification status before deployment.
4. **Approval Gate**: Human-in-the-loop ensures the deployment transaction isn't broadcasted without final manual sign-off.
5. **Qodo Code Quality**: Embedded CI/CD pipeline using CodiumAI's Qodo PR Agent ensures all agent-generated code satisfies clean architecture patterns.

## Repository Structure

- `.github/workflows/pr-review.yml`: Qodo PR-Agent Action for automated reviews.
- `skills/`: Sub-agent instruction kits (`web3-audit`, `gas-optimizer`).
- `mcp-server/`: FastMCP server providing blockchain context (Etherscan, RPC Gas stats).
- `sandbox-templates/`: The base Hardhat environment mounted by Daytona for isolated EVM testing.
- `ui/`: A premium Vite + React frontend dashboard to simulate agent interactions and audit reporting.

## Premium Web3 UI Dashboard

TrustForge includes a stunning, cyber-security-themed dashboard that visually simulates the AI agent's execution process. It features live-typing terminal animations, syntax highlighting, and live network statistics.

> **Note for Hackathon Judges:** The GitHub Pages UI deployment is a beautifully animated *visual simulation* of the agent's terminal. Because static GitHub Pages cannot directly execute our local Python FastMCP server, the UI mocks the live data fetching and security analysis to guarantee a flawless, rate-limit-free presentation. The actual live blockchain fetching and static analysis logic resides in the `mcp-server/` Python backend.

**Live Deployment:**
The UI is automatically deployed via GitHub Actions and is accessible on GitHub Pages.

**Running Locally:**
To run the UI on your own machine:
```bash
cd ui
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser to view the dashboard.

## FastMCP Server Configuration

TrustForge requires the MCP server to run as an SSE (Server-Sent Events) endpoint.

**Prerequisites:**
- Python 3.11+
- `pip install -r mcp-server/requirements.txt`

**Environment Variables:**
Create an `.env` file (or set these in TrueForge Connectors):
- `SEPOLIA_RPC_URL` (e.g., Infura, Alchemy)
- `ETHERSCAN_API_KEY`

**Starting the Server:**
```bash
python mcp-server/src/server.py
```
This starts the FastMCP server with SSE transport on `http://0.0.0.0:8000/sse`. Configure this URL in TrueForge under **Settings → Connectors**. 

## Qodo PR Agent Configuration

If you are using the provided GitHub Action, ensure you set the following repository secrets:
- `GITHUB_TOKEN`
- `OPENAI_API_KEY` (or `QODO_API_KEY` if using Qodo's hosted API)
