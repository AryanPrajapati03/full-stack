import React, { useState } from 'react';

const NAMES = [
  'Aarav', 'Ananya', 'Devansh', 'Ishita',
  'Kabir', 'Meera', 'Rohan', 'Sneha'
];

export default function LiveSearchFilter() {
  const [query, setQuery] = useState('');

  const filteredNames = NAMES.filter(name =>
    name.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h3>Q4: Live Search Filter</h3>
      <input
        type="text"
        placeholder="Search names..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredNames.length > 0 ? (
        <ul>
          {filteredNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}