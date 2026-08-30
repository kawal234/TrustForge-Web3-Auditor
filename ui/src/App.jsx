import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import SearchBar from './components/SearchBar';
import NetworkStats from './components/NetworkStats';
import AgentTerminal from './components/AgentTerminal';

function App() {
  const [auditAddress, setAuditAddress] = useState(null);

  const handleSearch = (address) => {
    setAuditAddress(address);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <ShieldAlert size={32} className="glow-text" style={{ color: 'var(--accent-cyan)' }} />
          <span>TrustForge</span>
        </div>
      </header>
      
      <main className="main-grid">
        <div className="sidebar-layout">
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: '600' }}>Audit Target</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Input a deployed smart contract address. The autonomous agent will analyze the source code and fetch live deployment parameters.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
          
          <NetworkStats />
        </div>
        
        <AgentTerminal 
          auditAddress={auditAddress} 
          resetTrigger={() => setAuditAddress(null)} 
        />
      </main>
    </div>
  );
}

export default App;
