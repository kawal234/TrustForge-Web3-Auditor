import os
import requests
from utils.sanitizers import sanitize_address

ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY", "")
ETHERSCAN_URL = os.getenv("ETHERSCAN_URL", "https://api-sepolia.etherscan.io/api")

def get_contract_source(address: str) -> dict:
    """Fetches verified contract source code from Etherscan."""
    safe_address = sanitize_address(address)
    if not safe_address:
        return {"error": "Invalid Ethereum address provided."}
        
    if not ETHERSCAN_API_KEY:
        return {"error": "ETHERSCAN_API_KEY is not configured on the server."}
        
    params = {
        "module": "contract",
        "action": "getsourcecode",
        "address": safe_address,
        "apikey": ETHERSCAN_API_KEY
    }
    
    try:
        response = requests.get(ETHERSCAN_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") == "1" and data.get("result"):
            return {
                "address": safe_address,
                "source_code": data["result"][0].get("SourceCode", ""),
                "compiler_version": data["result"][0].get("CompilerVersion", ""),
                "is_verified": bool(data["result"][0].get("SourceCode"))
            }
        return {"error": f"Etherscan API Error: {data.get('message')}", "details": data.get("result")}
    except Exception as e:
        return {"error": str(e)}
