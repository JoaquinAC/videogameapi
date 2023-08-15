const {
  createVideogame,
  getAllGames,
  getAllGamesearch,
  getGameDetailByName,
  getGameDetailByIDAPI,
  getGameDetailByIDBD,
  deleteGame,
  updateGame
} = require("../controllers/videogamesController")


//GET | /videogames/main/:page (Paginacion)

const getGamePaginationHandler = async (req, res) => {
    try {
      const { page } = req.params;
  
      // Validar el parámetro "page" para asegurarse de que sea un número válido
      const parsedPage = parseInt(page, 10);
      if (isNaN(parsedPage) || parsedPage < 1) {
        return res.status(400).json({ error: 'El número de página debe ser un valor entero mayor o igual a 1.' });
      }
  
      // Obtener la lista de juegos paginada desde la API
      const games = await getAllGames(parsedPage);
  
      // Enviar la respuesta con la lista de juegos
      res.status(200).json(games);
    } catch (error) {
      console.error(error);
  
      // Manejar errores específicos según el tipo de error
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'No se encontraron juegos para la página especificada.' });
      }
  
      res.status(500).json({ error: 'Error al obtener la lista de juegos.' });
    }
}

//GET | /videogames/homepage (Busqueda por Input)

const getGamesHandler = async (req, res) => {
    try {
      const search = await getAllGamesearch();
  
      // Verificar si se encontraron resultados de búsqueda
      if (!search || search.length === 0) {
        return res.status(404).json({ error: 'No se encontraron resultados de búsqueda.' });
      }
  
      res.status(200).json(search);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la búsqueda de juegos.' });
    }
  };

//GET | /videogames/api/:id 

const getGameByIDAPIHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const gameID = parseInt(id, 10);
  
      // Verificar si el ID es un número válido
      if (isNaN(gameID) || gameID < 1) {
        return res.status(400).json({ error: 'El ID del juego debe ser un valor entero mayor o igual a 1.' });
      }
  
      const byID = await getGameDetailByIDAPI(gameID);
  
      // Verificar si se encontró el juego con el ID especificado
      if (!byID) {
        return res.status(404).json({ error: 'No se encontró un juego con el ID especificado.' });
      }
  
      res.status(200).json(byID);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el juego mediante el ID.' });
    }
  };

///videogames/bd/:id 
const getGameByIDBDHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const byID = await getGameDetailByIDBD(id);
  
      // Verificar si se encontró el juego con el ID especificado
      if (!byID) {
        return res.status(404).json({ error: 'No se encontró un juego con el ID especificado.' });
      }
  
      res.status(200).json(byID);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el juego mediante el ID.' });
    }
};  

//GET | /videogames/?name=grandthefAuto

const getGameByNameHandler = async (req, res) => {
    try {
      const { name } = req.query;
  
      if (!name) {
        // Si no se proporciona un nombre de búsqueda, enviar una respuesta 400 (Bad Request)
        return res.status(400).json({ error: 'Se requiere un nombre de búsqueda.' });
      }
  
      // Realizar la búsqueda de juegos basada en el nombre proporcionado
      const searchResults = await getGameDetailByName(name);
  
      // Verificar si se encontraron resultados de búsqueda
      if (!searchResults || searchResults.length === 0) {
        return res.status(404).json({ error: 'No se encontraron resultados de búsqueda.' });
      }
  
      // Enviar la respuesta con los resultados de la búsqueda
      res.status(200).json(searchResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la búsqueda de juegos.' });
    }
  };
  
//POST /videogames/new

const createGameHandler = async (req, res) => {
  try {
    // Obtener los datos del nuevo videojuego desde el cuerpo de la solicitud
    const { name, description, plataform, image, releaseDate, rating, genres } = req.body;

    if (!Array.isArray(genres)) {
      throw new Error('El campo "genres" debe ser un array.');
    }
    
    // Crear el nuevo videojuego en la base de datos
    const newVideogame = await createVideogame(
      name,
      description,
      plataform,
      image,
      releaseDate,
      rating,
      genres.map((genre) => genre.toLowerCase()) // Convertir los géneros a minúsculas aquí
    );

    // Enviar una respuesta 201 (Created) con el nuevo videojuego creado
    res.status(201).json(newVideogame);
  } catch (error) {
    console.error(error);
    // Enviar una respuesta 500 (Internal Server Error) si ocurrió un error desconocido
    res.status(500).json({ error: 'Error al crear el videojuego.' });
  }
};
//DELETE /videogames/delete/:id

const deleteGameHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      const isDeleted = await deleteGame(id);
  
      if (isDeleted) {
        res.status(200).json({ message: 'Pokémon eliminado exitosamente.' });
      } else {
        res.status(404).json({ error: 'No se encontró el Pokémon especificado.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el Pokémon.' });
    }
  };

//PUT /pokemons/:id
const updateGameHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const isUpdated = await updateGame(id, updatedData);
  
      if (isUpdated) {
        res.status(200).json({ message: 'Pokémon actualizado exitosamente.' });
      } else {
        res.status(404).json({ error: 'No se encontró el Pokémon especificado.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el Pokémon.' });
    }
};

module.exports = {
    getGamePaginationHandler,
    getGamesHandler,
    getGameByIDBDHandler,
    getGameByIDAPIHandler,
    getGameByNameHandler,
    createGameHandler,
    deleteGameHandler,
    updateGameHandler
 }
 