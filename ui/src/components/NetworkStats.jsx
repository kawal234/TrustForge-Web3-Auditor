import React, { useState, useEffect } from 'react';
import { Activity, Database, Zap } from 'lucide-react';

export default function NetworkStats() {
  const [stats, setStats] = useState({
    block: "Loading...",
    baseFee: "Loading...",
    status: "Connecting..."
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/stats');
        const data = await response.json();
        
        if (data.network_connected) {
          setStats({
            block: data.latest_block.toLocaleString(),
            baseFee: `${data.base_fee_gwei} Gwei`,
            status: "Connected"
          });
        } else {
          setStats({
            block: "Unavailable",
            baseFee: "Unavailable",
            status: "Error"
          });
        }
      } catch (err) {
        setStats({
          block: "Unavailable",
          baseFee: "Unavailable",
          status: "API Offline"
        });
      }
    };
    
    fetchStats();
    // Poll every 12 seconds (average Ethereum block time)
    const interval = setInterval(fetchStats, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel stats-panel">
      <div className="stats-title">
        <Activity size={18} className="glow-text" />
        Live Network Data
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <Database size={16} className="stat-icon" />
          <span>Latest Block</span>
        </div>
        <div className="stat-value">{stats.block}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <Zap size={16} className="stat-icon" />
          <span>Base Fee</span>
        </div>
        <div className="stat-value">{stats.baseFee}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-header">
          <Activity size={16} className="stat-icon" />
          <span>Network Status</span>
        </div>
        <div className="stat-value" style={{ color: stats.status === "Connected" ? "var(--accent-cyan)" : "var(--text-muted)" }}>
          {stats.status}
        </div>
      </div>
    </div>
  );
}
