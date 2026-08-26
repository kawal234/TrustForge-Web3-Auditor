import pytest
from utils.sanitizers import sanitize_address

def test_sanitize_address_valid():
    addr = "0x71C7656EC7ab88b098defb751B7401B5f6d8976F"
    assert sanitize_address(addr) == "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"

def test_sanitize_address_invalid():
    assert sanitize_address("0xInvalidAddress") is None
    assert sanitize_address("123") is None
    assert sanitize_address("") is None
    assert sanitize_address(None) is None

# Note: Tests for rpc.py and etherscan.py would typically require mocking the Web3 
# and requests libraries to avoid hitting live networks during unit tests, 
# fitting Qodo's best practices for isolated testing.
