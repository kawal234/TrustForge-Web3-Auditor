import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input);
  };

  return (
    <div className="search-container" style={{ flexDirection: 'column', gap: '0.5rem', marginTop: '0' }}>
      <input 
        type="text" 
        className="search-input" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Contract Address (0x...)"
      />
      <button className="btn-primary" onClick={handleSubmit} style={{ marginTop: '0.5rem' }}>
        <Search size={18} />
        Initiate Audit
      </button>
    </div>
  );
}
