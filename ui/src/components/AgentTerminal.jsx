import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

// Simple regex-based syntax highlighter for terminal logs
const highlightSyntax = (text) => {
  // Split by words/tokens to apply spans
  const parts = text.split(/(\s+|0x[a-fA-F0-9]{40}|[a-zA-Z_]+\(\)|\[.*?\])/g);
  
  return parts.map((part, i) => {
    if (!part) return null;
    
    // Ethereum Address
    if (/^0x[a-fA-F0-9]{40}$/.test(part)) {
      return <span key={i} className="token-address">{part}</span>;
    }
    // Function calls
    if (/^[a-zA-Z_]+\(\)$/.test(part)) {
      return <span key={i} className="token-func">{part}</span>;
    }
    // Bracket Tags
    if (/^\[.*?\]$/.test(part)) {
      return <span key={i} className="token-keyword">{part}</span>;
    }
    
    return part;
  });
};

// Typewriter Component
const TypewriterText = ({ text, onComplete, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);

  return <>{highlightSyntax(displayedText)}</>;
};


export default function AgentTerminal({ triggerAudit, resetTrigger }) {
  const [logs, setLogs] = useState([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    if (triggerAudit) {
      startMockAuditFlow();
      resetTrigger();
    }
  }, [triggerAudit]);

  const startMockAuditFlow = () => {
    setLogs([]);
    setIsAuditing(true);
    
    const steps = [
      { type: 'user', delay: 100, text: '> Initiating full security audit for contract 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984...' },
      { type: 'agent', delay: 800, text: '[System] Calling tools.verify_contract_address()...' },
      { type: 'success', delay: 1500, text: '[Success] Valid contract found! Bytecode length: 14.8KB' },
      { type: 'agent', delay: 2200, text: '[System] Calling tools.get_contract_source() via Etherscan V2...' },
      { type: 'success', delay: 3500, text: '[Success] Source code fetched (23.8 KB). Compiler: v0.5.16+commit.9c3226ce' },
      { type: 'agent', delay: 4200, text: 'Analyzing source against Web3 Security Patterns (skills/web3-audit)...' },
      { type: 'warning', delay: 5800, text: '[Warning] Comp-style Governance pattern detected. Checking EIP-712 permit signatures...' },
      { type: 'success', delay: 7000, text: '[Audit Result] Contract perfectly follows ERC-20 standard. No reentrancy vulnerabilities detected.' },
      { type: 'agent', delay: 8000, text: '[System] Fetching live deployment cost via tools.get_network_gas_stats()...' },
      { type: 'success', delay: 9200, text: '[Complete] Live Network Base Fee: 0.0504 Gwei. Estimated deployment cost: ~0.001 ETH.' }
    ];

    let currentDelay = 0;
    
    steps.forEach((step, index) => {
      currentDelay += (step.delay || 0) + 100;
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
            // Add a small delay before clearing the loader
            setTimeout(() => setIsAuditing(false), 1000);
        }
      }, currentDelay);
    });
  };

  return (
    <div className="glass-panel terminal-panel">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>
        </div>
        <div className="terminal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
          <Terminal size={14} /> TrustForge Agent Execution Shell
        </div>
        <div style={{ width: '48px' }}></div> {/* Spacer for center alignment */}
      </div>
      
      <div className="terminal-body">
        {logs.length === 0 && !isAuditing && (
          <div style={{ color: 'var(--text-muted)' }}>
            System ready. Waiting for target contract address to begin static analysis and live network fetching...
          </div>
        )}
        
        {logs.map((log, i) => (
          <div key={i} className={`message ${log.type}`}>
             <TypewriterText text={log.text} speed={10} />
          </div>
        ))}
        
        {isAuditing && (
          <div className="loader" style={{ marginTop: '1rem' }}>
            <div></div><div></div><div></div><div></div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
}
