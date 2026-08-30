# TrustForge: Autonomous Web3 Smart Contract Auditor & Deployment Agent

An autonomous agent pipeline built on the TrueForge harness to securely audit, test, and deploy Web3 smart contracts.



https://github.com/user-attachments/assets/f73269a5-a744-4fa9-ac12-06e9b3b3f373

Live - https://kawal234.github.io/TrustForge-Web3-Auditor/

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

> **🏆 Note for Hackathon Judges:** The TrustForge UI is directly connected to our live Python FastMCP tools! To see the dashboard fetch **real, live Ethereum data** (actual block numbers, gas fees, and Etherscan contract verification), you must boot the backend on your machine first.

**How to Test the Live Dashboard:**
1. **Boot the Backend:** Open your terminal and run the local API server:
   ```bash
   pip install -r mcp-server/requirements.txt
   python mcp-server/src/api.py
   ```
   *(This starts the hybrid FastAPI server on port 8001, exposing the Web3 and Etherscan MCP tools).*
2. **Open the UI:** Navigate to the live GitHub Pages deployment at **[https://kawal234.github.io/TrustForge-Web3-Auditor/](https://kawal234.github.io/TrustForge-Web3-Auditor/)**.
3. **Run an Audit:** Input any Ethereum smart contract address (e.g., UNI token: `0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984`) and hit "Initiate Audit". The cloud-hosted UI will connect to your local backend to fetch and analyze the real on-chain data!

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
