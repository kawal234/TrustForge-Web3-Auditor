import React from 'react';
import { Activity, Server } from 'lucide-react';

export default function NetworkStats() {
  return (
    <div className="glass-panel stats-panel">
      <div className="stats-title">
        <Activity size={18} className="glow-text" />
        Live Network Data
      </div>
      
      <div className="stat-box">
        <div className="stat-label">Ethereum RPC Status</div>
        <div className="stat-value highlight" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="dot green"></div> Connected
        </div>
      </div>
      
      <div className="stat-box">
        <div className="stat-label">Latest Block</div>
        <div className="stat-value">25,861,340</div>
      </div>
      
      <div className="stat-box">
        <div className="stat-label">Base Fee (Gwei)</div>
        <div className="stat-value highlight">0.0504</div>
      </div>
      
      <div className="stat-box">
        <div className="stat-label">Etherscan API (V2)</div>
        <div className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={16} /> Active
        </div>
      </div>
    </div>
  );
}
