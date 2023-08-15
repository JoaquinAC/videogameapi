import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGamesPagination, getGameGenres } from '../../redux/actions.js';
import { Link } from 'react-router-dom/cjs/react-router-dom.js';
import Card from '../Card';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { AllGameAPI, AllGameBD, AllGamesInput, gameGenres } = useSelector((state) => state);
  //const [isGetGameDelayed, setIsGetGameDelayed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrigin, setSelectedOrigin] = useState('Origen');
  const [selectedGenre, setSelectedGenre] = useState('Genero');
  const [selectedOrder, setSelectedOrder] = useState('Orden');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    dispatch(getGamesPagination(1));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getGameGenres());
  }, [dispatch]);

  
  // useEffect(() => {
  //   if (!isGetGameDelayed) {
  //     // Simulamos un tiempo de carga de 10 segundos
  //     const delayTime = 4000; // 10 segundos

  //     const timer = setTimeout(() => {
  //       setIsGetGameDelayed(true);
  //     }, delayTime);

  //     return () => clearTimeout(timer);
  //   } else {
  //     dispatch(getGame());
  //   }
  // }, [dispatch, isGetGameDelayed]);

  useEffect(() => {
    // Apply filters and search when any of the select values or searchQuery changes
    let filtered;
    if (searchQuery.length === 0 && selectedOrigin === 'Origen' && selectedGenre === 'Genero' && selectedOrder === 'Orden') {
      // Use AllGameAPI and AllGameBD if all selectors and searchQuery are default/empty
      filtered = [...AllGameAPI, ...AllGameBD];
    } else {
      // Otherwise, use AllGamesInput as the base for filtering and searching
      filtered = AllGamesInput.game.filter((game) => {
        const originFilter = selectedOrigin === 'Origen' ? true : game.origen === selectedOrigin;
        const genreFilter =
          selectedGenre === 'Genero'
            ? true
            : game.genres?.includes(
                selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)
              );
        
        // Realizar la búsqueda insensible a mayúsculas y minúsculas
        const searchQueryLower = searchQuery.toLowerCase();
        const nameLower = game.name.toLowerCase();
        const searchQueryMatches = nameLower.includes(searchQueryLower);
        
        return originFilter && genreFilter && searchQueryMatches;
      });
    }

    // Apply sorting based on selectedOrder
    switch (selectedOrder) {
      case 'Asc Alphabetic':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Desc Alphabetic':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Asc Rating':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'Desc Rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    // Remove duplicates based on game id
    const uniqueFilteredGames = filtered.reduce((acc, game) => {
      if (!acc.find((item) => item.id === game.id)) {
        acc.push(game);
      }
      return acc;
    }, []);

    setFilteredGames(uniqueFilteredGames);
  }, [AllGameAPI, AllGameBD, AllGamesInput, selectedOrigin, selectedGenre, selectedOrder, searchQuery]);

  const handlePaginationClick = (page) => {
    setCurrentPage(page);
    dispatch(getGamesPagination(page));
  };

  const handleOriginChange = (event) => {
    setSelectedOrigin(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleOrderChange = (event) => {
    setSelectedOrder(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const shouldShowPagination =
    searchQuery.length === 0 && selectedOrigin === 'Origen' && selectedGenre === 'Genero' && selectedOrder === 'Orden';

  return (
    <div className='homepage-container'>
      <div className='homepage-navbar-container'>
        <h1>Home</h1>
        <input type="text" value={searchQuery} onChange={handleSearchInputChange} />
        <h3>Search 🔍︎</h3>
      </div> 

      <div className='homepage-barleft-container'>
        <Link to="/create">
              <button className="barleft-button">Crear Pokémon</button>
        </Link>  
      </div>

      
      <div className='game-list'>
        <div className='homepage-games-nav-container'>
          <select value={selectedOrigin} onChange={handleOriginChange} className='games-select1'>
            <option value="Origen">Origen</option>
            <option value="API">API</option>
            <option value="BD">BD</option>
          </select>
          <select value={selectedGenre} onChange={handleGenreChange} className='games-select2'>
            <option value="Genero">Genero</option>
            {gameGenres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select value={selectedOrder} onChange={handleOrderChange} className='games-select3'>
            <option value="Orden">Orden</option>
            <option value="Asc Alphabetic">Asc Alphabetic</option>
            <option value="Desc Alphabetic">Desc Alphabetic</option>
            <option value="Asc Rating">Asc Rating</option>
            <option value="Desc Rating">Desc Rating</option>
          </select>

          {shouldShowPagination && (
          <div className='game-list-buttons'>
            {[1, 2, 3, 4, 5, 6, 7].map((page) => (
              <button key={page} onClick={() => handlePaginationClick(page)}>
                {page}
              </button>
            ))}
          </div>
        )}
        </div>
        
        <div className='cards-container'>
        {filteredGames.map((game) => (
          <Link to={`/detail/${game.id}`} key={game.id} className="game-link">
          <Card
            key={game.id}
            id={game.id}
            image={game.image}
            name={game.name}
            genres={game.genres || []}
          />
          </Link>
        ))}

        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
