import { useState } from 'react';

export const SearchResults = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = () => {
    // Vulnerability: DOM-based XSS - directly inserting user input into innerHTML
    // without any sanitization
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      // This is the vulnerable pattern - directly injecting user input into HTML
      resultsContainer.innerHTML = `<div class="search-result">
        <h3>Search Results for: ${query}</h3>
        <p>Found ${Math.floor(Math.random() * 10)} results matching "${query}"</p>
        <ul>
          <li>Result 1: ${query} item</li>
          <li>Result 2: ${query} related content</li>
          <li>Result 3: More about ${query}</li>
        </ul>
      </div>`;
    }

    // Also storing unsanitized input in state and rendering
    setResults([`Search completed for: ${query}`]);
  };

  return (
    <div className="search-container p-4">
      <h2>Product Search</h2>
      <div className="search-form">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search-input"
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          id="search-button"
        >
          Search
        </button>
      </div>

      {/* Vulnerability: Reflecting user input directly into innerHTML */}
      <div
        id="search-results"
        className="mt-4 p-3 border"
        style={{ minHeight: '100px' }}
      />

      {/* Also vulnerable: rendering unsanitized state */}
      <div className="mt-3">
        {results.map((result, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: result }} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
