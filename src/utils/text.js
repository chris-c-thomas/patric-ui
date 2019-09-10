
import React from 'react';

export default function highlightText(text, query) {
  let parts = text.split(new RegExp(`(${query})`, 'gi'));
  return <span> { parts.map((part, i) =>
      <span key={i} style={part.toLowerCase() === query.toLowerCase() ? { fontWeight: 'bold', color: '#2684FF' } : {} }>
          { part }
      </span>)
  } </span>;
}