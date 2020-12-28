import React from 'react';

const Filter = ({ searchTerm, handleFilterChange }) => (
  <div className="filter-section">
        Filter shown with <input value={searchTerm} onChange={handleFilterChange} />
  </div>
)

export default Filter;