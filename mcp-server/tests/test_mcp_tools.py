from unittest.mock import MagicMock

# pyrefly: ignore [missing-import]
from utils.sanitizers import sanitize_address

# pyrefly: ignore [missing-import]
from tools.rpc import get_network_gas_stats, verify_contract_address

# pyrefly: ignore [missing-import]
from tools.etherscan import get_contract_source


def test_sanitize_address_valid():
    addr = "0x71C7656EC7ab88b098defb751B7401B5f6d8976F"
    assert sanitize_address(addr) == "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"


def test_sanitize_address_invalid():
    assert sanitize_address("0xInvalidAddress") is None
    assert sanitize_address("123") is None
    assert sanitize_address("") is None
    assert sanitize_address(None) is None


def test_get_network_gas_stats_success(mocker):
    mocker.patch("tools.rpc.w3.is_connected", return_value=True)
    mock_eth = MagicMock()
    mock_eth.get_block.return_value = {"baseFeePerGas": 50000000000}  # 50 gwei
    mock_eth.gas_price = 55000000000  # 55 gwei
    mocker.patch("tools.rpc.w3.eth", mock_eth)

    # Mock from_wei since w3 object is real but eth is mocked
    mocker.patch("tools.rpc.w3.from_wei", side_effect=lambda v, u: v / 1e9)

    res = get_network_gas_stats()
    assert res["network_connected"] is True
    assert res["base_fee_gwei"] == 50.0
    assert res["gas_price_gwei"] == 55.0


def test_get_network_gas_stats_disconnected(mocker):
    mocker.patch("tools.rpc.w3.is_connected", return_value=False)
    res = get_network_gas_stats()
    assert res["network_connected"] is False
    assert "Cannot connect" in res["error"]


def test_verify_contract_address_success(mocker):
    mocker.patch("tools.rpc.w3.is_connected", return_value=True)
    mock_eth = MagicMock()
    mock_eth.get_code.return_value = b"\x00\x01\x02"
    mocker.patch("tools.rpc.w3.eth", mock_eth)

    res = verify_contract_address("0x71C7656EC7ab88b098defb751B7401B5f6d8976F")
    assert res["is_contract"] is True
    assert res["bytecode_length"] == 3


def test_get_contract_source_success(mocker):
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "status": "1",
        "result": [{"SourceCode": "contract Test {}", "CompilerVersion": "v0.8.0"}],
    }
    mocker.patch("requests.get", return_value=mock_response)
    mocker.patch("tools.etherscan.ETHERSCAN_API_KEY", "dummy")

    res = get_contract_source("0x71C7656EC7ab88b098defb751B7401B5f6d8976F")
    assert res["source_code"] == "contract Test {}"
    assert res["is_verified"] is True
