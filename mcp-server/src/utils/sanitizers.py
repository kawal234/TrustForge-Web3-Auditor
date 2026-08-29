import re


def sanitize_address(address: str) -> str | None:
    """
    Validates and normalizes an Ethereum address.
    Returns checksummed address if valid, None otherwise.
    """
    if not address or not isinstance(address, str):
        return None

    # Basic regex validation for Ethereum address
    if not re.match(r"^0x[a-fA-F0-9]{40}$", address):
        return None

    # To avoid deep coupling with web3.py here (though we could use
    # Web3.to_checksum_address), returning the string as-is because
    # Web3 inside rpc.py will handle checksumming, but we can do a simple
    # lower/upper conversion or rely on Web3.
    from web3 import Web3

    return Web3.to_checksum_address(address)
