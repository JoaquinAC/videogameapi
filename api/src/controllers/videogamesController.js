const { Videogames , Genres} = require("../db");
const axios = require("axios")

//POST /videogames

const createVideogame = async (name, description, plataform, image, releaseDate, rating, genres) => {
  // if (
  //   typeof name !== 'string' ||
  //   typeof description !== 'string' ||
  //   !Array.isArray(plataforms) ||
  //   typeof image !== 'string' ||
  //   isNaN(Date.parse(releaseDate)) ||
  //   typeof rating !== 'number' ||
  //   !Array.isArray(genres)
  // ) {
  //   console.log(name, description, plataforms, image, releaseDate, rating, genres)
  //   throw new Error('Los tipos de datos de los parámetros no son válidos.');
  // }
    const lowerCasePlatforms = plataform.map((platforms) => platforms.toLowerCase());
  
    const newVideogame = await Videogames.create({
      name,
      description,
      plataform: lowerCasePlatforms, 
      image,
      fechaLanzamiento: releaseDate,
      rating,
    });
  
    const foundGenres = await Genres.findAll({ where: { name: genres.map(genre => genre.toLowerCase()) } });
  
    if (foundGenres.length !== genres.length) {
      throw new Error('No se encontraron todos los géneros especificados.');
    }
  
    await newVideogame.setGenres(foundGenres);
  
    return newVideogame;
  };
  

//GET (paginacion )| /videogames

const getAllGamesAPI = async (page) => {
    try {
      const videogames = [];
      const pageSize = 15;
  
      // Realizar la solicitud a la API para obtener los juegos de la página indicada
      const response = await axios.get(`https://api.rawg.io/api/games?key=35ff859c31824e1199457d87142be1ef&page_size=${pageSize}&page=${page}`);
      const { results } = response.data;
  
      // Obtener los detalles de cada juego utilizando la función recursiva getGameDetailByNameAPI
      const detallesJuegosPromesas = results.map(async (juego) => {
        const detalleJuego = await getGameDetailByNameAPI(juego.name);
        return {
          ...detalleJuego,
          origen: 'API',
        };
      });
  
      // Esperar a que todas las promesas de los detalles de los juegos se resuelvan
      const detallesJuegos = await Promise.all(detallesJuegosPromesas);
  
      // Agregar los detalles de los juegos al array de juegos
      videogames.push(...detallesJuegos);
  
      // Retornar el array de juegos que contiene todos los detalles de los juegos obtenidos de todas las páginas
      return videogames;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener la lista de videojuegos desde la API.');
    }
  };

const getAllGamesBD = async () => {
  try {
    const videogames = [];

    // Obtener todos los videojuegos de la base de datos
    const allVideogamesBD = await Videogames.findAll({
      include: {
        model: Genres,
        attributes: ['name'],
        through: { attributes: [] }, // Omitir los atributos de la tabla intermedia
      },
    });

    // Mapear los datos obtenidos a un formato deseado
    const allVideogamesMapped = allVideogamesBD.map((videogame) => {
      return {
        id: videogame.id,
        name: videogame.name,
        description: videogame.description,
        platforms: videogame.plataform, // Corregir el nombre del atributo si es necesario
        image: videogame.image,
        fechaLanzamiento: videogame.fechaLanzamiento,
        rating: videogame.rating, // Corregir el nombre del atributo si es necesario
        genres: videogame.Genres.map(genre => capitalizeFirstLetter(genre.name)), // Capitalizar la primera letra de cada género, // Obtener los nombres de los géneros asociados
        origen: 'BD',
      };
    });

    // Agregar los videojuegos mapeados al array de videojuegos
    videogames.push(...allVideogamesMapped);

    // Retornar la lista de videojuegos mapeados
    return videogames;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener la lista de videojuegos desde la base de datos.');
  }
};
const getAllGames = async (page) => {
    try {
      // Obtener los videojuegos de la API utilizando getAllVideogamesAPI
      const videogamesAPI = await getAllGamesAPI(page);
  
      // Obtener los videojuegos de la base de datos utilizando getAllVideogamesBD
      const videogamesBD = await getAllGamesBD();
  
      // Combinar los videojuegos de la API y de la base de datos en una sola lista
      const allVideogames = [...videogamesAPI, ...videogamesBD];
  
      // Retornar la lista completa de videojuegos
      return allVideogames;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener la lista de videojuegos.');
    }
  };

// Función para capitalizar la primera letra de una cadena
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//GET (busqueda por input )| /videogames (recursividad para solicitar cada las 7 primeras page)

const getAllGamesearch = async () => {
  try {
    // Caché para almacenar los resultados previos de las búsquedas
    const cache = {};

    // Array de promesas para realizar las solicitudes en paralelo
    const promises = [];

    // Realizar las solicitudes a la API para las páginas 1 a 7
    for (let page = 1; page <= 7; page++) {
      // Verificar si los datos de la página están en la caché
      if (cache[page]) {
        promises.push(Promise.resolve(cache[page])); // Devolver los datos de la caché
      } else {
        // Si no están en la caché, realizar la solicitud a la API
        promises.push(getAllGames(page).then((data) => {
          // Guardar los datos en la caché para futuras búsquedas
          cache[page] = data;
          return data;
        }));
      }
    }

    // Esperar a que todas las promesas se resuelvan usando Promise.all
    const results = await Promise.all(promises);

    // Combinar los resultados de todas las páginas en una única lista
    const allVideogames = results.flat();

    // Retornar la lista completa de videojuegos que incluye los de las páginas 1 a 7
    return allVideogames;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener la lista de videojuegos.');
  }
};

//  GET | /videogames/name?="..." //Por el momento , el uso de este endpoint sera para verificar en el formulario de creacion y no haya repetidos 
  
const getGameDetailByNameAPI = async (name) => {
    try {
      const nombre = name.toLowerCase();
      const response = await axios.get(
        `https://api.rawg.io/api/games?key=35ff859c31824e1199457d87142be1ef&search=${nombre}`
      );
  
      if (response.data.count === 0 || !response.data.results || response.data.results.length === 0) {
        return null; // No se encontró el juego en la API
      }
  
      const game = response.data.results[0];
  
      const gameDetail = {
        id: game.id,
        name: game.name,
        platforms: game.platforms.map((platform) => platform.platform.name),
        image: game.background_image,
        fechaLanzamiento: game.released,
        rating: game.rating,
        genres: game.genres.map((genre) => genre.name),
        short_screenshots: game.short_screenshots.map((img) => img.image),
        origen:'API'
      };
  
      return gameDetail;
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el detalle del juego desde la API.');
    }
  };

const getGameDetailByNameBD = async (name) => {
  try {
    const lowercaseName = name.toLowerCase();

    const videogame = await Videogames.findOne({
      where: { name: lowercaseName },
      include: [Genres] // Utilizamos el modelo Genres para incluir la relación muchos a muchos.
    });

    if (!videogame) {
      return undefined;
    }

    const genreNames = videogame.Genres.map((genre) => genre.name);

    const videogameDetail = {
      id: videogame.id,
      name: videogame.name,
      description: videogame.description,
      plataform: videogame.plataform,
      image: videogame.image,
      fechaLanzamiento: videogame.fechaLanzamiento,
      rating: videogame.rating,
      genres: genreNames, // Usamos el arreglo de géneros que obtenemos de la relación muchos a muchos.
      origen: 'BD',
    };

    return videogameDetail;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el detalle del videojuego desde la base de datos.');
  }
};

const getGameDetailByName = async (id) => {
  try {
    const apiResult = await getGameDetailByNameAPI(id); 
    const dbResult = await getGameDetailByNameBD(id); 
    
    let result = [];

    if (apiResult) {
      result.push(apiResult);
    }

    if (dbResult) {
      result.push(dbResult);
    }

    return result
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el detalle del Pokémon.');
  }
};
// GET | /videogames/:id

const getGameDetailByIDAPI = async (id) => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=35ff859c31824e1199457d87142be1ef`);

    const {     
      name,
      background_image,
      background_image_additional,
      description,
      platforms,
      released,
      rating,
      genres,
    } = response.data;

    const img = [background_image, background_image_additional];

    const plataform = platforms.map((platform) => platform.platform.name);

    const generos = genres.map((genre) => genre.name);

    const gameDetail = {
      id,
      name,
      img,
      descripcion: description,
      plataform,
      fechaLanzamiento: released,
      rating,
      generos,
      Origen: 'API',
    };

    return gameDetail;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el detalle del juego.');
  }
};

const getGameDetailByIDBD = async (id) => {
  try {
    const videogame = await Videogames.findByPk(id, {
      include: [Genres],
    });

    if (!videogame) {
      return undefined;
    }

    const genreNames = videogame.Genres.map((genre) => genre.name);
    const videogameDetail = {
      id: videogame.id,
      name: videogame.name,
      description: videogame.description,
      plataform: videogame.plataform,
      image: videogame.image,
      fechaLanzamiento: videogame.fechaLanzamiento,
      rating: videogame.rating,
      genres: genreNames,
      origen: 'BD',
    };

    return videogameDetail;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el detalle del videojuego desde la base de datos.');
  }
};


// DELETE /videogames/delete/:id

const deleteGame = async (id) => {
  try {
    const videogame = await Videogames.findByPk(id);

    if (!videogame) {
      throw new Error('No se encontró el videojuego especificado.');
    }
    await videogame.setGenres([]);
    await videogame.destroy();
    return true;
  } catch (error) {
    console.error(error);
    throw new Error('Error al eliminar el videojuego de la base de datos.');
  }
};


//PUT /videogames/put/:id

/*
const updatedData = {
  name: 'Nuevo nombre del videojuego',
  description: 'Nueva descripción del videojuego',
  plataform: ['Plataforma 1', 'Plataforma 2'],
  image: 'https://ejemplo.com/nueva-imagen.png',
  fechaLanzamiento: '2023-07-30',
  rating: 4.8,
  genres: ['Género 1', 'Género 2'],
};
*/

const updateGame = async (videogameId, updatedData) => {
  try {
    const videogame = await Videogames.findByPk(videogameId, {
      include: [Genres], // Incluir los géneros asociados al videojuego
    });

    if (!videogame) {
      throw new Error('No se encontró el videojuego especificado.');
    }

    // Actualizar los datos del videojuego con la información proporcionada
    await videogame.update(updatedData);

    // Si se proporcionaron géneros, actualizar la relación "muchos a muchos"
    if (updatedData.genres) {
      // Obtener los IDs de los géneros proporcionados
      const genreIds = await Promise.all(
        updatedData.genres.map(async (genreName) => {
          const genre = await Genres.findOne({ where: { name: genreName } });
          if (!genre) {
            throw new Error(`No se encontró el género ${genreName}.`);
          }
          return genre.id;
        })
      );

      // Actualizar la relación "muchos a muchos" entre el videojuego y los géneros
      await videogame.setGenres(genreIds);
    }

    const genres = await videogame.getGenres();
    const updatedGenreNames = genres.map((genre) => genre.nombre);

    const updatedVideogame = {
      id: videogame.id,
      name: videogame.name,
      description: videogame.description,
      plataform: videogame.plataform,
      image: videogame.image,
      fechaLanzamiento: videogame.fechaLanzamiento,
      rating: videogame.rating,
      genres: updatedGenreNames,
    };

    return updatedVideogame;
  } catch (error) {
    console.error(error);
    throw new Error('Error al actualizar el videojuego en la base de datos.');
  }
};

module.exports = {
  createVideogame,
  getAllGames,
  getAllGamesearch,
  getGameDetailByName,
  getGameDetailByIDAPI,
  getGameDetailByIDBD,
  deleteGame,
  updateGame
};


