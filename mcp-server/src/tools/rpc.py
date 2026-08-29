import os
from typing import Any
from web3 import Web3
from web3.exceptions import Web3Exception
from utils.sanitizers import sanitize_address

RPC_URL = os.getenv("ETH_RPC_URL", "https://ethereum-rpc.publicnode.com")
w3 = Web3(Web3.HTTPProvider(RPC_URL))


def get_network_gas_stats() -> dict[str, Any]:
    """Fetches the latest block base fee and recommended gas prices."""
    if not w3.is_connected():
        return {
            "error": "Cannot connect to the configured RPC provider.",
            "network_connected": False,
        }

    try:
        latest_block = w3.eth.get_block("latest")
        base_fee = latest_block.get("baseFeePerGas", 0)
        gas_price = w3.eth.gas_price

        return {
            "latest_block": latest_block.get("number"),
            "base_fee_gwei": float(w3.from_wei(base_fee, "gwei")),
            "gas_price_gwei": float(w3.from_wei(gas_price, "gwei")),
            "network_connected": True,
        }
    except Web3Exception as e:
        return {"error": f"Web3 error: {e}", "network_connected": False}
    except Exception as e:
        return {"error": str(e), "network_connected": False}


def verify_contract_address(address: str) -> dict[str, Any]:
    """Checks if an address is a deployed contract and returns bytecode length."""
    safe_address = sanitize_address(address)
    if not safe_address:
        return {"error": "Invalid Ethereum address format."}

    if not w3.is_connected():
        return {"error": "Cannot connect to the configured RPC provider."}

    try:
        code = w3.eth.get_code(safe_address)
        is_contract = len(code) > 0

        return {
            "address": safe_address,
            "is_contract": is_contract,
            "bytecode_length": len(code),
        }
    except Web3Exception as e:
        return {"error": f"Web3 error: {e}"}
    except Exception as e:
        return {"error": str(e)}
