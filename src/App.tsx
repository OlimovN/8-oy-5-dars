import React, { useState } from 'react';
import Filter from './components/Filter';
import Cards from './components/Cards';

interface Filters {
  search: string;
  category: string;
  company: string;
  sort: string;
  price: number;
}

function App() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    company: '',
    sort: '',
    price: 0,
  });

  function handleFilterChange(newFilters: Filters) {
    setFilters(newFilters);
  }

  return (
    <div>
      <Filter onFilterChange={handleFilterChange} />
      <Cards filters={filters} />
    </div>
  );
}

export default App;
