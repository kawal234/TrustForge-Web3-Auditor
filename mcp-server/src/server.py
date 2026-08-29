# pyrefly: ignore [missing-import]
from mcp.server.fastmcp import FastMCP
from tools.rpc import get_network_gas_stats, verify_contract_address
from tools.etherscan import get_contract_source

# Initialize FastMCP Server
mcp = FastMCP("TrustForge-Web3-Connector")

# Register tools
mcp.tool()(get_network_gas_stats)
mcp.tool()(verify_contract_address)
mcp.tool()(get_contract_source)

if __name__ == "__main__":
    # For TrueForge connector integration, expose an SSE endpoint via HTTP.
    print("Starting TrustForge Web3 MCP Server on http://0.0.0.0:8000/sse")
    # mcp.run() defaults to stdio if no arguments provided, but we can
    # instruct FastMCP to use SSE. Currently, FastMCP provides an ASGI app
    # for SSE via mcp._mcp_server. For simplicity, we just call
    # mcp.run(transport="sse") if supported by fastmcp version.

    # Run the FastMCP server using its built-in SSE transport support
    # (assuming mcp>=1.0.0)
    mcp.settings.port = 8000
    mcp.settings.host = "0.0.0.0"

    # type: ignore
    mcp.settings.transport_security.enable_dns_rebinding_protection = False

    mcp.run(transport="sse")
