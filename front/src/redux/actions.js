import axios from 'axios';
import {
    GET_GAME_PAGINATION_SUCCESS,
    GET_GAME_INPUT_SUCCESS,
    GET_GAME_API_BD_BY_ID_SUCCESS,
    GET_GAME_BY_NAME_SUCCESS,
    GET_GAME_GENRES_SUCCESS,
    CREATE_GAME_SUCCESS,
    CREATE_GAME_ERROR,
    DELETE_GAME_SUCCESS,
    DELETE_GAME_ERROR,
    MODIFY_GAME_SUCCESS,
    MODIFY_GAME_ERROR
  } from './action-types';


//GET ALL GAMES (PAGINACION)
  export const getGamesPagination = (page) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/videogames/main/${page}`);
        const game = response.data;
  
        // Mapear los resultados según su origen y asignarlos a los initial states correspondientes
        const allGameAPI = [];
        const allGameBD = [];
  
        game.forEach((pokemon) => {
          if (pokemon.origen === 'API') {
            allGameAPI.push(pokemon);
          } else if (pokemon.origen === 'BD') {
            allGameBD.push(pokemon);
          }
        });
  
        dispatch(getGamePaginationSucess(allGameAPI, allGameBD));
      } catch (error) {
        console.error(error);
        // Manejo de errores o lanzamiento de acciones de error
      }
    };
  };

  const getGamePaginationSucess = (allGameAPI, allGameBD) => ({
    type: GET_GAME_PAGINATION_SUCCESS,
    payload: {
      allGameAPI,
      allGameBD,
    },
  });

//GET ALL GAMES (Input Search)
  export const getGame = () => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/videogames/homepage`);
        const game = response.data;
    
        dispatch(getGameSucess(game));
      } catch (error) {
        console.error(error);
      }
    };
  };

  const getGameSucess = (game) => ({
    type: GET_GAME_INPUT_SUCCESS,
    payload: {
        game
    },
  });

//GET GAME BD BY ID
  export const getGameByIdSuccess = (gameDetails) => ({
    type: GET_GAME_API_BD_BY_ID_SUCCESS,
    payload: gameDetails,
  });

  export const getGameBDById = (id) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/videogames/bd/${id}`);
        const gameDetails = response.data;
        dispatch(getGameByIdSuccess(gameDetails));
      } catch (error) {
        console.error(error);
      }
    };
  };
//GET GAME API BY ID
  export const getGameById = (id) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/videogames/api/${id}`);
        const gameDetails = response.data;
        dispatch(getGameByIdSuccess(gameDetails));
      } catch (error) {
        console.error(error);
      }
    };
  };

//GET GAME BY NAME
  export const getGameByName = (name) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(`http://localhost:3001/videogames/?name=${name}`);
        const game = response.data;
  
        dispatch(getGameByNameSuccess(game));
      } catch (error) {
        console.error(error);
        // Manejo de errores o lanzamiento de acciones de error
      }
    };
  };

  const getGameByNameSuccess = (game) => ({
    type: GET_GAME_BY_NAME_SUCCESS,
    payload: {
      game,
    },
  });

//GET GENRES 

  export const getGameGenres = () => {
    return async (dispatch) => {
      try {
        const response = await axios.get('http://localhost:3001/genres');
        const genres = response.data;
  
        dispatch(getGameGenresSuccess(genres));
      } catch (error) {
        console.error(error);
      }
    };
  };

  export const getGameGenresSuccess = (genres) => ({
    type: GET_GAME_GENRES_SUCCESS,
    payload:genres,
  });

//CREATE
  export const createGame = (gameData) => {
    return async (dispatch) => {
      try {
        const response = await axios.post('http://localhost:3001/videogames/new', gameData);
        const createdGame = response.data;
  
        dispatch(createGameSuccess(createdGame));
      } catch (error) {
        console.error(error);
        // Manejo de error en caso de que la petición falle
        dispatch(createGameError(error))
      }
    };
  };

  export const createGameSuccess = (pokemon) => {
    return {
      type: CREATE_GAME_SUCCESS,
      payload: pokemon,
    };
  };

  export const createGameError = (error) => {
    return {
      type: CREATE_GAME_ERROR,
      payload: error,
    };
  };

//DELETE POKEMON
  
  export const deleteGame = (id) => {
    return async (dispatch) => {
      try {
        const response = await axios.delete(` http://localhost:3001/videogames/delete/${id}`);
        const deleteGame = response.data;
        dispatch(deleteGameSuccess(deleteGame));
      } catch (error) {
        console.error(error);
        dispatch(deleteGameError(error))
      }
    };
  };
  
  export const deleteGameSuccess = (deleteGame) => {
    return {
      type: DELETE_GAME_SUCCESS,
      payload: deleteGame ,
    };
  };

  export const deleteGameError = (error) => {
    return {
      type: DELETE_GAME_ERROR,
      payload: error,
    };
  };
//MODIFY POKEMON 
  
  export const modifyGame = (id, modifiedData) => {
    return async (dispatch) => {
      try {
        await axios.put(`http://localhost:3001/videogames/put/${id}`, modifiedData);
  
        // Después de modificar el Pokémon, obtener el Pokémon modificado por su ID
        const response = await axios.get(`http://localhost:3001/videogames/${id}`);
        const modifiedPokemon = response.data;
  
        dispatch(modifyGameSuccess(modifiedPokemon));
      } catch (error) {
        console.error(error);
        // Manejo de error en caso de que la petición falle
        dispatch(modifyGameError(error));
      }
    };
  };

  export const modifyGameSuccess = (game) => {
    return {
      type: MODIFY_GAME_SUCCESS,
      payload: game,
    };
  };

  export const modifyGameError = (error) => {
    return {
      type: MODIFY_GAME_ERROR,
      payload: error,
    };
  };