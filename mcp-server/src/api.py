from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# pyrefly: ignore [missing-import]
from tools.rpc import get_network_gas_stats, verify_contract_address
# pyrefly: ignore [missing-import]
from tools.etherscan import get_contract_source

app = FastAPI(title="TrustForge UI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stats")
def get_stats():
    """Fetch live gas and block stats from Ethereum RPC"""
    return get_network_gas_stats()

@app.get("/api/audit/{address}")
def get_audit(address: str):
    """Fetch contract verification and source code"""
    verification = verify_contract_address(address)
    source = None
    if verification.get("is_contract"):
        source = get_contract_source(address)
    
    return {
        "address": address,
        "verification": verification,
        "source": source
    }

if __name__ == "__main__":
    print("Starting TrustForge UI REST API on http://0.0.0.0:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)
