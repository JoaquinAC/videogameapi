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


  const initialState = {
    AllGamesInput: [],
    AllGameAPI: [],
    AllGameBD: [],
    gameByName: [],
    gameByID:[],
    gameGenres: [],
    createdGame: null,
    error:null,
    deletedGame:null,
    modifyGame:null,
  };
  

const gameReducer = (state = initialState, action) => {
    switch (action.type) {  
        case GET_GAME_PAGINATION_SUCCESS:
            return {
            ...state,
            AllGameAPI: action.payload.allGameAPI,
            AllGameBD: action.payload.allGameBD,
            };

        case GET_GAME_INPUT_SUCCESS:
            return {
            ...state,
            AllGamesInput: action.payload
            };
        case GET_GAME_API_BD_BY_ID_SUCCESS:
            return {
            ...state,
            gameByID: [action.payload],
            };

        case GET_GAME_BY_NAME_SUCCESS:
            return {
            ...state,
            gameByName: action.payload
            };
        case GET_GAME_GENRES_SUCCESS:
            return {
            ...state,
            gameGenres: action.payload
            };
        case CREATE_GAME_SUCCESS:
            return {
            ...state,
            createdGame: action.payload,
            error: null,
            };
        case CREATE_GAME_ERROR:
            return {
            ...state,
            createdGame: null,
            error: action.payload,
            };
        case DELETE_GAME_SUCCESS:
            return {
            ...state,
            deletedGame: action.payload,
            error: null,
            }; 
        case DELETE_GAME_ERROR:
            return {
            ...state,
            deletedGame: null,
            error: action.payload,
            };
        case MODIFY_GAME_SUCCESS:
            return {
            ...state,
            modifyGame: action.payload,
            error: null,
            }; 
        case MODIFY_GAME_ERROR:
            return {
            ...state,
            modifyGame: null,
            error: action.payload,
            };  
        
        default:
            return state;
        
    }
};


export default gameReducer;