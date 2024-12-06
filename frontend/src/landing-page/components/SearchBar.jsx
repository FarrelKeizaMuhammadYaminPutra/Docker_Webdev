import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardData from './CardData';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = CardData.filter(movie =>
        movie.name.toLowerCase().includes(query)
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies([]);
    }
  };

  const handleMovieClick = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search Movies..."
        className='landing-page'
      />
      {searchQuery && filteredMovies.length > 0 && (
        <div className="search-results">
          {filteredMovies.map(movie => (
            <div key={movie.id} onClick={() => handleMovieClick(movie.id)}>
              <p>{movie.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
